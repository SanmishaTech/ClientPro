<?php

namespace App\Http\Controllers\Api;

use File;
use Response;
use Mpdf\Mpdf;
use Carbon\Carbon;
use App\Models\Client;
use App\Models\FamilyMember;
use Illuminate\Http\Request;
use Mpdf\Config\FontVariables;
use Mpdf\Config\ConfigVariables;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\BaseController;


class ReportsController extends BaseController
{
    public function birthdayReport(Request $request)
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

        $from_date = \Carbon\Carbon::parse($from_date);
        $to_date = \Carbon\Carbon::parse($to_date);
          
        
          // Extract month and day for filtering
         $fromMonthDay = $from_date->format('m-d');
         $toMonthDay = $to_date->format('m-d');
     
                    $clients = Client::with([
                "mediclaimInsurances" => function($query) {
                    $query->where("cancelled", false);
                },
                "loans" => function($query) {
                    $query->where("cancelled", false);
                },
                "termPlans" => function($query) {
                    $query->where("cancelled", false);
                },
                "lics" => function($query) {
                    $query->where("cancelled", false);
                },
                "generalInsurances" => function($query) {
                    $query->where("cancelled", false);
                },
                "mutualFunds" => function($query) {
                    $query->where("cancelled", false);
                },
                "dematAccounts" => function($query) {
                    $query->where("cancelled", false);
                }
            ])
            ->whereRaw("DATE_FORMAT(date_of_birth, '%m-%d') BETWEEN ? AND ?", [$fromMonthDay, $toMonthDay])
            ->orderByRaw("DATE_FORMAT(date_of_birth, '%m-%d') ASC");

            // Apply the conditional filtering based on mediclaim_insurance and term_plan
            $clients = $clients->where(function ($query) use ($mediclaim_insurance, $term_plan ,$lic,$loan,$general_insurance,$demat_account,$mutual_fund) {
                if ($mediclaim_insurance) {
                    $query->whereHas("mediclaimInsurances", function($query) {
                        $query->where("cancelled", false)
                            ->whereNull("family_member_id");
                    });
                }
                if ($term_plan) {
                    $query->orWhereHas("termPlans", function($query) {
                        $query->where("cancelled", false)
                            ->whereNull("family_member_id");
                    });
                }
                 if ($lic) {
                    $query->orWhereHas("lics", function($query) {
                        $query->where("cancelled", false)
                            ->whereNull("family_member_id");
                    });
                }
               if ($loan) {
                    $query->orWhereHas("loans", function($query) {
                        $query->where("cancelled", false);
                    });
                }
                if ($general_insurance) {
                    $query->orWhereHas("generalInsurances", function($query) {
                        $query->where("cancelled", false)
                            ->whereNull("family_member_id");
                    });
                }
                 if ($demat_account) {
                    $query->orWhereHas("dematAccounts", function($query) {
                        $query->where("cancelled", false)
                            ->whereNull("family_member_id");
                    });
                }
                 if ($mutual_fund) {
                    $query->orWhereHas("mutualFunds", function($query) {
                        $query->where("cancelled", false)
                            ->whereNull("family_member_id");
                    });
                }
            });

            // Fetch the results
            $clients = $clients->get();


    
        // family members
    $familyMembers = FamilyMember::with([
        "mediclaimInsurances" => function($query) {
            $query->where("cancelled", false);
        },
        "loans" => function($query) {
            $query->where("cancelled", false);
        },
        "termPlans" => function($query) {
            $query->where("cancelled", false);
        },
        "lics" => function($query) {
            $query->where("cancelled", false);
        },
        "generalInsurances" => function($query) {
            $query->where("cancelled", false);
        },
        "mutualFunds" => function($query) {
            $query->where("cancelled", false);
        },
        "dematAccounts" => function($query) {
            $query->where("cancelled", false);
        }
    ])
    ->whereRaw("DATE_FORMAT(family_member_dob, '%m-%d') BETWEEN ? AND ?", [$fromMonthDay, $toMonthDay])
    ->orderByRaw("DATE_FORMAT(family_member_dob, '%m-%d') ASC");

    
     // Apply the conditional filtering based on mediclaim_insurance and term_plan
            $familyMembers = $familyMembers->where(function ($query) use ($mediclaim_insurance, $term_plan ,$lic,$loan,$general_insurance,$demat_account,$mutual_fund) {
                if ($mediclaim_insurance) {
                    $query->whereHas("mediclaimInsurances", function($query) {
                        $query->where("cancelled", false);
                    });
                }
                if ($term_plan) {
                    $query->orWhereHas("termPlans", function($query) {
                        $query->where("cancelled", false);
                    });
                }
                 if ($lic) {
                    $query->orWhereHas("lics", function($query) {
                        $query->where("cancelled", false);
                    });
                }
               if ($loan) {
                    $query->orWhereHas("loans", function($query) {
                        $query->where("cancelled", false);
                    });
                }
                if ($general_insurance) {
                    $query->orWhereHas("generalInsurances", function($query) {
                        $query->where("cancelled", false);
                    });
                }
                 if ($demat_account) {
                    $query->orWhereHas("dematAccounts", function($query) {
                        $query->where("cancelled", false);
                    });
                }
                 if ($mutual_fund) {
                    $query->orWhereHas("mutualFunds", function($query) {
                        $query->where("cancelled", false);
                    });
                }
            });

            // Fetch the results
            $familyMembers = $familyMembers->get();


        $data = [
            'clients' => $clients,
            'familyMembers' => $familyMembers,
            'from_date' => $from_date,
            'to_date' => $to_date,
            'fromMonthDay' =>$fromMonthDay,
            'toMonthDay'=>$toMonthDay,
            'is_mediclaim_insurance' => $mediclaim_insurance,
            'is_term_plan' => $term_plan,
            'is_lic' => $lic,
            'is_loan' => $loan,
            'is_general_insurance' => $general_insurance,
            'is_demat_account' => $demat_account,
            'is_mutual_fund' => $mutual_fund,

        ];

         if (!($mediclaim_insurance || $term_plan || $lic || $loan || $general_insurance || $demat_account || $mutual_fund)) {
              //when no checkbox is checked
            $html = view('Reports.BirthdayReport.index_all', $data)->render();

        }else{
            //when at least 1 checkbox is checked
       // Render the Blade view to HTML
        $html = view('Reports.BirthdayReport.index', $data)->render();

        }


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

        if (!($mediclaim_insurance || $term_plan || $lic || $loan || $general_insurance || $demat_account || $mutual_fund)) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => [
                    'checkboxError' => ['At least one checkbox should be checked.']
                ],
            ], 422);
        }

    
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
                $query->where('cancelled', false)
                ->whereBetween('created_at', [$from_date, $to_date]);
            })->with(['mediclaimInsurances' => function($query) use ($from_date, $to_date) {
                $query->where('cancelled', false)
                ->whereBetween('created_at', [$from_date, $to_date]);
            }]);
        }])
        ->where(function ($query) use ($from_date, $to_date) {
            // For clients with general insurances created within the date range
            $query->whereHas('mediclaimInsurances', function($query) use ($from_date, $to_date) {
                $query->where('cancelled', false)
                ->whereBetween('created_at', [$from_date, $to_date]);
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
                $query->where('cancelled', false);
                $query->whereBetween('created_at', [$from_date, $to_date]);
            })->with(['termPlans' => function($query) use ($from_date, $to_date) {
                $query->where('cancelled', false);
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }]);
        }])
        ->where(function ($query) use ($from_date, $to_date) {
            // For clients with general insurances created within the date range
            $query->whereHas('termPlans', function($query) use ($from_date, $to_date) {
                $query->where('cancelled', false);
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
                $query->where('cancelled', false);
                $query->whereBetween('created_at', [$from_date, $to_date]);
            })->with(['lics' => function($query) use ($from_date, $to_date) {
                $query->where('cancelled', false);
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }]);
        }])
        ->where(function ($query) use ($from_date, $to_date) {
            // For clients with general insurances created within the date range
            $query->whereHas('lics', function($query) use ($from_date, $to_date) {
                $query->where('cancelled', false);
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
                $query->where('cancelled', false);
                $query->whereBetween('created_at', [$from_date, $to_date]);
            })->with(['generalInsurances' => function($query) use ($from_date, $to_date) {
                $query->where('cancelled', false);
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }]);
        }])
        ->where(function ($query) use ($from_date, $to_date) {
            // For clients with general insurances created within the date range
            $query->whereHas('generalInsurances', function($query) use ($from_date, $to_date) {
                $query->where('cancelled', false);
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
                       $query->where('cancelled', false);
                       $query->whereBetween('created_at', [$from_date, $to_date]);
                   })->with(['dematAccounts' => function($query) use ($from_date, $to_date) {
                       $query->where('cancelled', false);
                       $query->whereBetween('created_at', [$from_date, $to_date]);
                   }]);
               }])
               ->where(function ($query) use ($from_date, $to_date) {
                   // For clients with general insurances created within the date range
                   $query->whereHas('dematAccounts', function($query) use ($from_date, $to_date) {
                        $query->where('cancelled', false);  
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
                    $query->where('cancelled', false);
                    $query->whereBetween('created_at', [$from_date, $to_date]);
                })->with(['mutualFunds' => function($query) use ($from_date, $to_date) {
                    $query->where('cancelled', false);
                    $query->whereBetween('created_at', [$from_date, $to_date]);
                }]);
            }])
            ->where(function ($query) use ($from_date, $to_date) {
                // For clients with general insurances created within the date range
                $query->whereHas('mutualFunds', function($query) use ($from_date, $to_date) {
                    $query->where('cancelled', false);
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
                $query->where('cancelled', false);
                $query->whereBetween('created_at', [$from_date, $to_date]);
            }])
            ->where(function ($query) use ($from_date, $to_date) {
                // For clients with loans created within the date range
                $query->whereHas('loans', function($query) use ($from_date, $to_date) {
                    $query->where('cancelled', false);
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

    public function portfolioReport(Request $request)
    {
        $clientId = $request->input("client_id");

        $client = Client::with([
            'familyMembers.mediclaimInsurances', // Eager load mediclaimInsurances for familyMembers
            'familyMembers.loans',               // Eager load loans for familyMembers
            'familyMembers.termPlans',               // Eager load loans for familyMembers
            'familyMembers.lics',               // Eager load loans for familyMembers
            'familyMembers.generalInsurances',               // Eager load loans for familyMembers
            'familyMembers.mutualFunds',               // Eager load loans for familyMembers
            'familyMembers.dematAccounts',               // Eager load loans for familyMembers
            'mediclaimInsurances',               // Eager load mediclaimInsurances directly on Client
            'loans',                             // Eager load loans directly on Client
            'termPlans',                         // Eager load termPlans
            'lics',                              // Eager load lics
            'generalInsurances',                 // Eager load generalInsurances
            'mutualFunds',                       // Eager load mutualFunds
            'dematAccounts'                      // Eager load dematAccounts
        ])->find($clientId);
        
        if (!$client) {
            return $this->sendError("Client not found", ['error' => 'Client not found']);
        }
        
        $data = [
            'client' => $client,
        ];

        // Render the Blade view to HTML
        $html = view('Reports.PortfolioReport.index', $data)->render();

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
            
         
            // Set header HTML with dynamic values
            $headerHtml = '
            <div style="text-align: center;">
                <p style="margin: 0; padding: 0; font-size:17px;">Portfolio Report</p>
            </div>
            <p style="border: 1px solid black; width:100%; margin:0px; padding:0px; margin-bottom:5px;"></p>';
            
            // Set the header for each page
            $mpdf->SetHTMLHeader($headerHtml);
            
           
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