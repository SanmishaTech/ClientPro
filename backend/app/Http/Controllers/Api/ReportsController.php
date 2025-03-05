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

       
        // mediclaim insurance start
    //     $mediclaimClients = null;
    //     if($mediclaim_insurance){
    //     $mediclaimClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date, $mediclaim_insurance) {
        
    //         // If 'mediclaim_insurance' is true, filter family members who have mediclaimInsurances
    //         if ($mediclaim_insurance) {
    //             $query->whereHas('mediclaimInsurances')
    //                   ->with('mediclaimInsurances')
    //                   ->whereBetween('created_at', [$from_date, $to_date]);
    //         }
    //     }])
    //     ->where(function ($query) use ($from_date, $to_date, $mediclaim_insurance) {
    //         // Include clients whose birthday is within the selected range
        
    //         // If 'mediclaim_insurance' is true, filter clients who have mediclaimInsurances
    //         if ($mediclaim_insurance) {
    //             $query->whereHas('mediclaimInsurances')
    //                   ->with('mediclaimInsurances')
    //                   ->whereBetween('created_at', [$from_date, $to_date]);
    //         }
        
    //         // Include clients who have family members with a birthday within the selected range
    //         $query->orWhereHas('familyMembers', function($query) use ($from_date, $to_date,$mediclaim_insurance) {
    //             if ($mediclaim_insurance) {
    //                 $query->whereHas('mediclaimInsurances')
    //                       ->with('mediclaimInsurances')
    //                       ->whereBetween('created_at', [$from_date, $to_date]);
    //             }
    //         });
    //     });
        
    //     $mediclaimClients = $mediclaimClients->orderBy('created_at','desc')->get();
    // }

    $mediclaimClients = null;

    if ($mediclaim_insurance) {
        $mediclaimClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date) {
            // Get family members with general insurances created within the date range
            $query->whereHas('mediclaimInsurances', function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            })->with(['mediclaimInsurances' => function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }]);
        }])
        ->where(function ($query) use ($from_date, $to_date) {
            // For clients with general insurances created within the date range
            $query->whereHas('mediclaimInsurances', function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            });
        })
        ->orderBy('created_at', 'desc')
        ->get();
    }
    // mediclaim insurance end


    
    // term plan start
    //     $termPlanClients = null;
    //     if($term_plan){
    //     $termPlanClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date, $term_plan) {
        
    //         if ($term_plan) {
    //             $query->whereHas('termPlans')
    //                 ->with('termPlans')
    //                 ->whereBetween('created_at', [$from_date, $to_date]);
    //         }
    //     }])
    //     ->where(function ($query) use ($from_date, $to_date, $term_plan) {
            
    //         if ($term_plan) {
    //             $query->whereHas('termPlans')
    //                 ->with('termPlans')
    //                 ->whereBetween('created_at', [$from_date, $to_date]);
    //         }
        
    //         // Include clients who have family members with a birthday within the selected range
    //         $query->orWhereHas('familyMembers', function($query) use ($from_date, $to_date,$term_plan) {
    //             if ($term_plan) {
    //                 $query->whereHas('termPlans')
    //                     ->with('termPlans')
    //                     ->whereBetween('created_at', [$from_date, $to_date]);
    //             }
    //         });
    //     });
        
    //     $termPlanClients = $termPlanClients->orderBy('created_at','desc')->get();
    // }

    $termPlanClients = null;

    if ($term_plan) {
        $termPlanClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date) {
            // Get family members with general insurances created within the date range
            $query->whereHas('termPlans', function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            })->with(['termPlans' => function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }]);
        }])
        ->where(function ($query) use ($from_date, $to_date) {
            // For clients with general insurances created within the date range
            $query->whereHas('termPlans', function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            });
        })
        ->orderBy('created_at', 'desc')
        ->get();
    }
        //term plan end


         // LIC start
    //      $licClients = null;
    //      if($lic){
    //      $licClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date, $lic) {
         
    //          if ($lic) {
    //              $query->whereHas('lics')
    //                  ->with('lics')
    //                  ->whereBetween('created_at', [$from_date, $to_date]);
    //          }
    //      }])
    //      ->where(function ($query) use ($from_date, $to_date, $lic) {
    //          // Include clients whose birthday is within the selected range
         
    //          // If 'mediclaim_insurance' is true, filter clients who have mediclaimInsurances
    //          if ($lic) {
    //              $query->whereHas('lics')
    //                  ->with('lics')
    //                  ->whereBetween('created_at', [$from_date, $to_date]);
    //          }
         
    //          // Include clients who have family members with a birthday within the selected range
    //          $query->orWhereHas('familyMembers', function($query) use ($from_date, $to_date,$lic) {
    //              if ($lic) {
    //                  $query->whereHas('lics')
    //                      ->with('lics')
    //                      ->whereBetween('created_at', [$from_date, $to_date]);
    //              }
    //          });
    //      });
         
    //      $licClients = $licClients->orderBy('created_at','desc')->get();
    //  }
    $licClients = null;

    if ($lic) {
        $licClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date) {
            // Get family members with general insurances created within the date range
            $query->whereHas('lics', function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            })->with(['lics' => function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }]);
        }])
        ->where(function ($query) use ($from_date, $to_date) {
            // For clients with general insurances created within the date range
            $query->whereHas('lics', function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            });
        })
        ->orderBy('created_at', 'desc')
        ->get();
    }
         //LIC end


           // General Insurance start
    //        $generalInsuranceClients = null;
    //        if($general_insurance){
    //        $generalInsuranceClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date, $general_insurance) {
           
    //            if ($general_insurance) {
    //                $query->whereHas('generalInsurances')
    //                    ->with('generalInsurances')
    //                    ->whereBetween('created_at', [$from_date, $to_date]);
    //            }
    //        }])
    //        ->where(function ($query) use ($from_date, $to_date, $general_insurance) {
    //            // Include clients whose birthday is within the selected range
           
    //            // If 'mediclaim_insurance' is true, filter clients who have mediclaimInsurances
    //            if ($general_insurance) {
    //                $query->whereHas('generalInsurances')
    //                    ->with('generalInsurances')
    //                    ->whereBetween('created_at', [$from_date, $to_date]);
    //            }
           
    //            // Include clients who have family members with a birthday within the selected range
    //            $query->orWhereHas('familyMembers', function($query) use ($from_date, $to_date,$general_insurance) {
    //                if ($general_insurance) {
    //                    $query->whereHas('generalInsurances')
    //                        ->with('generalInsurances')
    //                        ->whereBetween('created_at', [$from_date, $to_date]);
    //                }
    //            });
    //        });
           
    //        $generalInsuranceClients = $generalInsuranceClients->orderBy('created_at','desc')->get();
    //    }



    $generalInsuranceClients = null;

    if ($general_insurance) {
        $generalInsuranceClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date) {
            // Get family members with general insurances created within the date range
            $query->whereHas('generalInsurances', function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            })->with(['generalInsurances' => function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }]);
        }])
        ->where(function ($query) use ($from_date, $to_date) {
            // For clients with general insurances created within the date range
            $query->whereHas('generalInsurances', function($query) use ($from_date, $to_date) {
                $query->whereBetween('created_at', [$from_date, $to_date]);
            });
        })
        ->orderBy('created_at', 'desc')
        ->get();
    }
           //General Insurance end


    //  demat account satrt
           $dematAccountClients = null;

           if ($demat_account) {
               $dematAccountClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date) {
                   // Get family members with general insurances created within the date range
                   $query->whereHas('dematAccounts', function($query) use ($from_date, $to_date) {
                       $query->whereBetween('created_at', [$from_date, $to_date]);
                   })->with(['dematAccounts' => function($query) use ($from_date, $to_date) {
                       $query->whereBetween('created_at', [$from_date, $to_date]);
                   }]);
               }])
               ->where(function ($query) use ($from_date, $to_date) {
                   // For clients with general insurances created within the date range
                   $query->whereHas('dematAccounts', function($query) use ($from_date, $to_date) {
                       $query->whereBetween('created_at', [$from_date, $to_date]);
                   });
               })
               ->orderBy('created_at', 'desc')
               ->get();
           }
    //demat account end


        //  mutual fund satrt
        $mutualFundClients = null;

        if ($mutual_fund) {
            $mutualFundClients = Client::with(['familyMembers' => function($query) use ($from_date, $to_date) {
                // Get family members with general insurances created within the date range
                $query->whereHas('mutualFunds', function($query) use ($from_date, $to_date) {
                    $query->whereBetween('created_at', [$from_date, $to_date]);
                })->with(['mutualFunds' => function($query) use ($from_date, $to_date) {
                    $query->whereBetween('created_at', [$from_date, $to_date]);
                }]);
            }])
            ->where(function ($query) use ($from_date, $to_date) {
                // For clients with general insurances created within the date range
                $query->whereHas('mutualFunds', function($query) use ($from_date, $to_date) {
                    $query->whereBetween('created_at', [$from_date, $to_date]);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();
        }
        //mutual fund end


            // loan start
        $loanClients = null;

        if ($loan) {
            $loanClients = Client::with(['familyMembers','loans' => function($query) use ($from_date, $to_date) {
                // Filter the loans to only include those created within the date range
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }])
            ->where(function ($query) use ($from_date, $to_date) {
                // For clients with loans created within the date range
                $query->whereHas('loans', function($query) use ($from_date, $to_date) {
                    $query->whereBetween('created_at', [$from_date, $to_date]);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();
        }
        // loan end


        $data = [
            'mediclaimClients' => $mediclaimClients,
            'termPlanClients' => $termPlanClients,
            'licClients' => $licClients,
            'generalInsuranceClients' => $generalInsuranceClients,
            'dematAccountClients' => $dematAccountClients,
            'loanClients' => $loanClients,
            'mutualFundClients' => $mutualFundClients,
            'mediclaim_insurance'=> $mediclaim_insurance,
            'term_plan' => $term_plan,
            'lic' => $lic,
            'general_insurance' => $general_insurance,
            'demat_account' => $demat_account,
            'mutual_fund' => $mutual_fund,
            'loan' => $loan,
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