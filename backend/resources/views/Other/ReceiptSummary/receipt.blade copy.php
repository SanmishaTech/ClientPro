<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
    body {
        font-family: "freeserif";
        margin-bottom: 50px;

    }

    table {
        margin-bottom: 50px;
    }

    table,
    th,
    td {
        border: 1px solid black;
    }

    th,
    td {
        padding: 5px;
        margin: 5px;
    }

    thead {
        display: table-header-group;
    }
    </style>
</head>

<body>

    {{-- <h4 style="margin:0px; padding:0px;">श्री गणेश मंदिर संस्थान - सर्व पावत्या {{ \Carbon\Carbon::parse($from_date)->format('d/m/Y') }}
    ते {{ \Carbon\Carbon::parse($to_date)->format('d/m/Y') }}</h4>
    <p style="border: 1px solid black; width:100%; margin:0px; padding:0px; margin-bottom:5px;"></p> --}}
    <table style="width: 100%">
        <thead>
            <tr>
                <th>Receipt Type</th>
                <th>Bank</th>
                <th>Cash</th>
                <th>Card</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>

            <tr>
                <td colspan="5">receipt head</td>
            </tr>
            <tr>
                <td>receipt type</td>
                <td>bank55</td>
                <td>cash 3434</td>
                <td>card 22</td>
                <td>total 343</td>
            </tr>
            <tr>
                <td>H total</td>
                <td>bank55</td>
                <td>cash 3434</td>
                <td>card 22</td>
                <td>total 343</td>
            </tr>

        </tbody>

    </table>


    <h1>new</h1>
    @foreach($receiptsWithTotal as $receiptHead => $data)

    <table style="width: 100%">
        <thead>
            <tr>
                <th>Receipt Type</th>
                <th>Bank</th>
                <th>Cash</th>
                <th>Card</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>

            <tr>
                <td colspan="5">{{$receiptHead}}</td>
            </tr>
            <tr>
                <td>{{ $data['receipts'][0]->receiptType->receipt_type }}</td>
                <td>bank55</td>
                <td>cash 3434</td>
                <td>card 22</td>
                <td>total 343</td>
            </tr>
            <tr>
                <td>H total</td>
                <td>bank55</td>
                <td>cash 3434</td>
                <td>card 22</td>
                <td>total 343</td>
            </tr>

        </tbody>

    </table>
    @endforeach




    {{--  --}}


    @foreach($receiptsWithTotal as $receiptHead => $data)
    <table>
        <thead>
            <tr>
                <th colspan="5">{{ $receiptHead }} Receipts</th>
            </tr>
            <tr>
                <th>Receipt Type</th>
                <th>Bank</th>
                <th>Cash</th>
                <th>Card</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['receipts'] as $receipt)
            <tr>
                <td>{{ $receipt->receiptType->receipt_type ?? 'N/A' }}</td>
                <td>{{ $receipt->bank ?? 'N/A' }}</td>
                <td>{{ $receipt->amount ?? 'N/A' }}</td>
                <td>{{ $receipt->card ?? 'N/A' }}</td>
                <td>{{ $receipt->amount + $receipt->card ?? 0 }}</td>
            </tr>
            @endforeach

            <!-- Add total row -->
            <tr>
                <td colspan="4" style="text-align: right; font-weight: bold;">Total Amount</td>
                <td>{{ $data['total_amount'] }}</td>
            </tr>
        </tbody>
    </table>
    @endforeach


    {{-- chat --}}


    @foreach($receiptsWithTotal as $receiptHead => $data)
    <table style="width: 100%">
        <thead>
            <tr>
                <th>Receipt Type</th>
                <th>Bank</th>
                <th>Cash</th>
                <th>Card</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <!-- Display Receipt Head Title -->
            <tr>
                <td colspan="5" style="font-weight: bold;">{{ $receiptHead }} Receipts</td>
            </tr>

            {{-- Initialize totals --}}
            @php
            $totalBank = 0;
            $totalCash = 0;
            $totalCard = 0;
            $totalAmount = 0;
            @endphp

            {{-- Loop through receipts and calculate totals --}}
            @foreach($data['receipts'] as $receipt)
            @php
            $bank = $receipt->bank ?? 0;
            $cash = $receipt->amount ?? 0;
            $card = $receipt->card ?? 0;
            $totalBank += $bank;
            $totalCash += $cash;
            $totalCard += $card;
            $totalAmount += ($cash + $card + $bank);
            @endphp
            @endforeach

            <!-- Display calculated totals -->
            <tr>
                <td>{{ $data['receipts'][0]->receiptType->receipt_type ?? 'N/A' }}</td>
                <td>{{ number_format($totalBank, 2) }}</td>
                <td>{{ number_format($totalCash, 2) }}</td>
                <td>{{ number_format($totalCard, 2) }}</td>
                <td>{{ number_format($totalAmount, 2) }}</td>
            </tr>

            <!-- Display the overall totals (sum of all receipt types) -->
            <tr>
                <td style="font-weight: bold;">Total Amount</td>
                <td>{{ number_format($totalBank, 2) }}</td>
                <td>{{ number_format($totalCash, 2) }}</td>
                <td>{{ number_format($totalCard, 2) }}</td>
                <td>{{ number_format($totalAmount, 2) }}</td>
            </tr>

        </tbody>
    </table>
    @endforeach

    <h1>fvffedf</h1>


    @foreach($receiptsWithTotal as $receiptHead => $data)
    <table style="width: 100%">
        <thead>
            <tr>
                <th>Receipt Type</th>
                <th>Bank</th>
                <th>Cash</th>
                <th>Cheque</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <!-- Display Receipt Head Title -->
            <tr>
                <td colspan="5" style="font-weight: bold;">{{ $receiptHead }} Receipts</td>
            </tr>

            {{-- Loop through receipts and display them --}}
            @foreach($data['receipts'] as $receipt)
            <tr>
                <td>{{ $receipt->receiptType->receipt_type ?? 'N/A' }}</td>
                <td>{{ $receipt->payment_mode == 'Bank' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                <td>{{ $receipt->payment_mode == 'Cash' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                <td>{{ $receipt->payment_mode == 'Card' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                <td>{{ number_format($receipt->amount, 2) }}</td>
            </tr>
            @endforeach

            <!-- Display calculated totals -->
            <tr>
                <td style="font-weight: bold;">Total</td>
                <td>{{ number_format($data['total_bank'], 2) }}</td>
                <td>{{ number_format($data['total_cash'], 2) }}</td>
                <td>{{ number_format($data['total_cheque'], 2) }}</td>
                <td>{{ number_format($data['total_amount'], 2) }}</td>
            </tr>

        </tbody>
    </table>
    @endforeach


    <h1>my cod3e</h1>


    @foreach($receiptsWithTotal as $receiptHead => $data)
    <table style="width: 100%">
        <thead>
            <tr>
                <th>Receipt Type</th>
                <th>Bank</th>
                <th>Cash</th>
                <th>Cheque</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <!-- Display Receipt Head Title -->
            <tr>
                <td colspan="5" style="font-weight: bold;">{{ $receiptHead }} Receipts</td>
            </tr>

            {{-- Loop through receipts and display them --}}
            {{-- @foreach($data['receipts'] as $receipt) --}}
            <tr>
                <td>{{  $data['receipts'][0]->receiptType->receipt_type ?? 'N/A'}}</td>
                {{-- <td>{{ $receipt->payment_mode == 'Bank' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                <td>{{ $receipt->payment_mode == 'Cash' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                <td>{{ $receipt->payment_mode == 'Card' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                <td>{{ number_format($receipt->amount, 2) }}</td> --}}
                <td>{{ number_format($data['total_bank'], 2) }}</td>
                <td>{{ number_format($data['total_cash'], 2) }}</td>
                <td>{{ number_format($data['total_cheque'], 2) }}</td>
                <td>{{ number_format($data['total_amount'], 2) }}</td>
            </tr>
            {{-- @endforeach --}}

            <!-- Display calculated totals -->
            <tr>
                <td style="font-weight: bold;">Total</td>
                <td>{{ number_format($data['total_bank'], 2) }}</td>
                <td>{{ number_format($data['total_cash'], 2) }}</td>
                <td>{{ number_format($data['total_cheque'], 2) }}</td>
                <td>{{ number_format($data['total_amount'], 2) }}</td>
            </tr>

        </tbody>
    </table>
    @endforeach


</body>



</html>


/*

<body>

    @foreach($receiptsWithTotal as $receiptHead => $data)
    <table>
        <thead>
            <tr>
                <th colspan="5">{{ $receiptHead }} Receipts</th>
            </tr>
            <tr>
                <th>Receipt Type</th>
                <th>Bank</th>
                <th>Cash</th>
                <th>Card</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['receipts'] as $receipt)
            <tr>
                <td>{{ $receipt->receiptType->receipt_type ?? 'N/A' }}</td>
                <td>{{ $receipt->bank ?? 'N/A' }}</td>
                <td>{{ $receipt->amount ?? 'N/A' }}</td>
                <td>{{ $receipt->card ?? 'N/A' }}</td>
                <td>{{ $receipt->amount + $receipt->card ?? 0 }}</td>
            </tr>
            @endforeach

            <!-- Add total row -->
            <tr>
                <td colspan="4" style="text-align: right; font-weight: bold;">Total Amount</td>
                <td>{{ $data['total_amount'] }}</td>
            </tr>
        </tbody>
    </table>
    @endforeach

</body>
*/



i am using react for the frontend and laravel for the backed

{selectedReceiptTypeId === poojaPavtiAnekReceiptId && (
<>
    <div className="w-full flex justify-around">
        <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
            <div className="relative">
                <Label className="font-normal" htmlFor="pooja_type_id">
                    Pooja Type:
                </Label>
                <Controller name="pooja_type_id" control={control} render={({ field })=> (
                    <Popover open={openPoojaType} onOpenChange={setOpenPoojaType}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" aria-expanded={openPoojaType ? "true" : "false" }
                                // This should depend on the popover state className=" w-[325px] justify-between mt-1"
                                onClick={()=>
                                setOpenPoojaType((prev) => !prev)
                                } // Toggle popover on button click
                                >
                                {field.value
                                ? allPoojaTypesData?.PoojaTypes &&
                                allPoojaTypesData?.PoojaTypes.find(
                                (poojaType) =>
                                poojaType.id === field.value
                                )?.pooja_type
                                : "Select Pooja Type..."}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[325px] p-0">
                            <Command>
                                <CommandInput placeholder="Search pooja type..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>
                                        No pooja type found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {allPoojaTypesData?.PoojaTypes &&
                                        allPoojaTypesData?.PoojaTypes.map(
                                        (poojaType) => (
                                        <CommandItem key={poojaType.id} value={poojaType.id} onSelect={(currentValue)=>
                                            {
                                            setValue(
                                            "pooja_type_id",
                                            poojaType.id
                                            );
                                            setSelectedPoojaTypeId(
                                            poojaType.id
                                            );
                                            setOpenPoojaType(false);
                                            // Close popover after selection
                                            }}
                                            >
                                            {poojaType.pooja_type}
                                            <Check className={cn( "ml-auto" , poojaType.id===field.value ? "opacity-100"
                                                : "opacity-0" )} />
                                        </CommandItem>
                                        )
                                        )}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    )}
                    />
                    {errors.pooja_type_id && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.pooja_type_id.message}
                    </p>
                    )}
            </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-4 items-center gap-7 md:gap-1">
            {selectedPoojaTypeId &&
            poojaDatesData?.PoojaDates?.map((poojaDate) => (
            <div key={poojaDate.id} className="relative flex gap-2 md:pt-10 md:pl-2">
                <input type="checkbox" id={poojaDate.pooja_date}
                    className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                <Label className="font-normal" htmlFor={poojaDate.pooja_date}>
                    {poojaDate.pooja_date}
                </Label>
            </div>
            ))}
        </div>
    </div>
</>
)}

i am displaying the checkbox of dates when user selects the checkboxes i want u to create an array of dates and send to
payload.

currently i am using react query mutation but dont use that for creating array and send to payload . use aother way