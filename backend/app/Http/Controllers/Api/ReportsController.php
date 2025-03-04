<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;
use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;
use File;
use Response;
use Mpdf\Mpdf;
use Carbon\Carbon;


class ReportsController extends BaseController
{
    public function birthdayReport(Request $request)
    {
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');

        // $clients = Client::with(['familyMembers' => function($query) use ($from_date,$to_date) {
        //     $from_date = \Carbon\Carbon::parse($from_date)->startOfDay();
        //     $to_date = \Carbon\Carbon::parse($to_date)->endOfDay();
        //     $query->whereBetween('family_member_dob', [$from_date, $to_date]);
        // }]);
           
        
        // $from_date = \Carbon\Carbon::parse($from_date)->startOfDay();
        // $to_date = \Carbon\Carbon::parse($to_date)->endOfDay();
        // $clients->whereBetween('date_of_birth', [$from_date, $to_date]);
        // $clients = $clients->get();
          // Ensure the dates are in the correct format (e.g., Y-m-d)
    $from_date = \Carbon\Carbon::parse($from_date)->startOfDay();
    $to_date = \Carbon\Carbon::parse($to_date)->endOfDay();

    // Get clients with their family members' date of birth filtered
    $clients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date) {
        // Apply the date filter to family members' date_of_birth
        $query->whereBetween('family_member_dob', [$from_date, $to_date]);
    }])
    ->where(function ($query) use ($from_date, $to_date) {
        // Include clients whose birthday is within the selected range
        $query->whereBetween('date_of_birth', [$from_date, $to_date])
              ->orWhereHas('familyMembers', function($query) use ($from_date, $to_date) {
                  // Include clients if at least one family member's birthday is within the range
                  $query->whereBetween('family_member_dob', [$from_date, $to_date]);
              });
    })
    ->get();

       
        
        $data = [
            'clients' => $clients,
            'from_date' => $from_date,
            'to_date' => $to_date,
        ];

        // Render the Blade view to HTML
        $html = view('Reports.BirthdayReport.index', $data)->render();

        // Create a new mPDF instance
        // $mpdf = new Mpdf();
            // $mpdf = new Mpdf(['mode' => 'utf-8', 'format' => 'A4', 'orientation' => 'L']);  // 'P' is for portrait (default)
            $defaultConfig = (new ConfigVariables())->getDefaults();
            $fontDirs = $defaultConfig['fontDir'];
        
            $defaultFontConfig = (new FontVariables())->getDefaults();
            $fontData = $defaultFontConfig['fontdata'];

            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => 'A4',
                'orientation' => 'P',
                'fontDir' => array_merge($fontDirs, [
                    storage_path('fonts/'), // Update to point to the storage/fonts directory
                ]),
                'fontdata' => $fontData + [
                    'notosansdevanagari' => [
                        'R' => 'NotoSansDevanagari-Regular.ttf',
                        'B' => 'NotoSansDevanagari-Bold.ttf',
                    ], 
                ],
                'default_font' => 'notosansdevanagari',
                'margin_top' => 18,        // Set top margin to 0
                'margin_left' => 8,      // Optional: Set left margin if needed
                'margin_right' => 8,     // Optional: Set right margin if needed
                'margin_bottom' => 20,     // Optional: Set bottom margin if needed
            ]);
            
            $fromDateFormatted = \Carbon\Carbon::parse($from_date)->format('d/m/Y');
            $toDateFormatted = \Carbon\Carbon::parse($to_date)->format('d/m/Y');
            
            // Set header HTML with dynamic values
            $headerHtml = '
            <div style="text-align: center;">
                <p style="margin: 0; padding: 0; font-size:17px;">Birthday Report ' . $fromDateFormatted . ' To ' . $toDateFormatted . '</p>
            </div>
            <p style="border: 1px solid black; width:100%; margin:0px; padding:0px; margin-bottom:5px;"></p>';
            
            // Set the header for each page
            $mpdf->SetHTMLHeader($headerHtml);
            
            // $footerHtml = '
            // <div style="border-top: 1px solid black; display: flex; justify-content: space-between; padding: 5px;">
            //     <p style="margin: 0; text-align: center; flex: 1;">Printed on ' . \Carbon\Carbon::now()->format('d-m-Y H:i') . '</p>
            //     <p style="margin: 0; text-align: right; flex: 1;">Page {PAGENO} of {nb}</p>
            // </div>';
            $footerHtml = '
            <div style="border-top: 1px solid black; margin-top: 5px;"></div> <!-- Line above the footer -->
            <div style="width: 100%; text-align: center; padding-top: 5px;">
                <span>Printed on ' . \Carbon\Carbon::now()->format('d/m/Y h:i A') . '</span>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 <span>Page {PAGENO} of {nb}</span>
            </div>';
        
            
            $mpdf->SetHTMLFooter($footerHtml);


        // Write HTML to the PDF
        $mpdf->WriteHTML($html);
        // Output the PDF for download
        return $mpdf->Output('report.pdf', 'D'); // Download the PDF
        // return $this->sendResponse([], "Invoice generated successfully");
    }

    public function clientReport(Request $request)
    {
        $from_date = $request->input('from_date');
        $to_date = $request->input('to_date');
        $mediclaim_insurance = $request->input('mediclaim_insurance');
        $term_plan = $request->input('term_plan');
        $lic = $request->input('lic');
        $loan = $request->input('loan');
        $general_insurance = $request->input('general_insurance');
        $demat_account = $request->input('demat_account');
        $mutual_fund = $request->input('mutual_fund');
        
        $from_date = \Carbon\Carbon::parse($from_date)->startOfDay();
        $to_date = \Carbon\Carbon::parse($to_date)->endOfDay();

        // $clients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date) {
        //     $query->whereBetween('created_at', [$from_date, $to_date]);
            
        // }])
        // ->where(function ($query) use ($from_date, $to_date) {
        //     // Include clients whose birthday is within the selected range
        //     $query->whereBetween('created_at', [$from_date, $to_date])
        //         ->orWhereHas('familyMembers', function($query) use ($from_date, $to_date) {
        //             // Include clients if at least one family member's birthday is within the range
        //             $query->whereBetween('created_at', [$from_date, $to_date]);
        //         });
        // })
        // ;
        $clients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date, $mediclaim_insurance) {
            // Apply date filter on family members
            $query->whereBetween('created_at', [$from_date, $to_date]);
        
            // If 'mediclaim_insurance' is true, filter family members who have mediclaimInsurances
            if ($mediclaim_insurance) {
                $query->whereHas('mediclaimInsurances')
                      ->with('mediclaimInsurances');
            }
        }])
        ->where(function ($query) use ($from_date, $to_date, $mediclaim_insurance) {
            // Include clients whose birthday is within the selected range
            $query->whereBetween('created_at', [$from_date, $to_date]);
        
            // If 'mediclaim_insurance' is true, filter clients who have mediclaimInsurances
            if ($mediclaim_insurance) {
                $query->whereHas('mediclaimInsurances')
                      ->with('mediclaimInsurances');
            }
        
            // Include clients who have family members with a birthday within the selected range
            $query->orWhereHas('familyMembers', function($query) use ($from_date, $to_date,$mediclaim_insurance) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
                if ($mediclaim_insurance) {
                    $query->whereHas('mediclaimInsurances')
                          ->with('mediclaimInsurances');
                }
            });
        });
        
        

        $clients = $clients->orderBy('created_at')->get();

        $data = [
            'clients' => $clients,
            'from_date' => $from_date,
            'to_date' => $to_date,
        ];

        // Render the Blade view to HTML
        $html = view('Reports.ClientReport.index', $data)->render();

        // Create a new mPDF instance
        // $mpdf = new Mpdf();
            // $mpdf = new Mpdf(['mode' => 'utf-8', 'format' => 'A4', 'orientation' => 'L']);  // 'P' is for portrait (default)
            $defaultConfig = (new ConfigVariables())->getDefaults();
            $fontDirs = $defaultConfig['fontDir'];
        
            $defaultFontConfig = (new FontVariables())->getDefaults();
            $fontData = $defaultFontConfig['fontdata'];

            $mpdf = new Mpdf([
                'mode' => 'utf-8',
                'format' => 'A4',
                'orientation' => 'P',
                'fontDir' => array_merge($fontDirs, [
                    storage_path('fonts/'), // Update to point to the storage/fonts directory
                ]),
                'fontdata' => $fontData + [
                    'notosansdevanagari' => [
                        'R' => 'NotoSansDevanagari-Regular.ttf',
                        'B' => 'NotoSansDevanagari-Bold.ttf',
                    ], 
                ],
                'default_font' => 'notosansdevanagari',
                'margin_top' => 18,        // Set top margin to 0
                'margin_left' => 8,      // Optional: Set left margin if needed
                'margin_right' => 8,     // Optional: Set right margin if needed
                'margin_bottom' => 20,     // Optional: Set bottom margin if needed
            ]);
            
            $fromDateFormatted = \Carbon\Carbon::parse($from_date)->format('d/m/Y');
            $toDateFormatted = \Carbon\Carbon::parse($to_date)->format('d/m/Y');
            
            // Set header HTML with dynamic values
            $headerHtml = '
            <div style="text-align: center;">
                <p style="margin: 0; padding: 0; font-size:17px;">Client Report ' . $fromDateFormatted . ' To ' . $toDateFormatted . '</p>
            </div>
            <p style="border: 1px solid black; width:100%; margin:0px; padding:0px; margin-bottom:5px;"></p>';
            
            // Set the header for each page
            $mpdf->SetHTMLHeader($headerHtml);
            
            // $footerHtml = '
            // <div style="border-top: 1px solid black; display: flex; justify-content: space-between; padding: 5px;">
            //     <p style="margin: 0; text-align: center; flex: 1;">Printed on ' . \Carbon\Carbon::now()->format('d-m-Y H:i') . '</p>
            //     <p style="margin: 0; text-align: right; flex: 1;">Page {PAGENO} of {nb}</p>
            // </div>';
            $footerHtml = '
            <div style="border-top: 1px solid black; margin-top: 5px;"></div> <!-- Line above the footer -->
            <div style="width: 100%; text-align: center; padding-top: 5px;">
                <span>Printed on ' . \Carbon\Carbon::now()->format('d/m/Y h:i A') . '</span>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 <span>Page {PAGENO} of {nb}</span>
            </div>';
        
            
            $mpdf->SetHTMLFooter($footerHtml);


        // Write HTML to the PDF
        $mpdf->WriteHTML($html);
        // Output the PDF for download
        return $mpdf->Output('report.pdf', 'D'); // Download the PDF
        // return $this->sendResponse([], "Invoice generated successfully");
    }
}