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
    table{
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

    <table style="width: 100%">
        <thead>
            <tr>
                <th>Receipt No</th>
                <th>Receipt Date</th>
                <th>Name</th>
                <th>Mode</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            
            @foreach($receiptsWithTotal as $receiptHead => $receiptHeadData)
                <!-- Display Receipt Head Title -->
                <tr>
                    <td colspan="5" style="font-weight: bold;">{{ $receiptHead }}</td>
                </tr>

                {{-- Loop through each receiptType within the current receiptHead --}}
                @foreach($receiptHeadData as $receiptTypeId => $data)
                    <tr>
                        <td colspan="5" >{{ $data['receipts']->first()->receiptType->receipt_type ?? 'N/A' }}</td>
                    </tr>
                    @foreach($data['receipts'] as $receipt)
                    <tr>
                        <td>{{ $receipt->receipt_no }}</td>
                        <td>{{ \Carbon\Carbon::parse($receipt->receipt_date)->format('d/m/Y') }}</td>
                        <td>{{ $receipt->name }}</td>
                        <td>{{ $receipt->payment_mode }}</td>
                        <td style="text-align: right;">{{ number_format($receipt->amount, 2) }}</td>
                    </tr>
                @endforeach
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="font-weight: bold; text-align:right">T Total:</td>
                    <td style="font-weight: bold; text-align:right">{{ number_format($data['receipts']->sum('amount'), 2) }}</td>
                </tr>
                @endforeach
               
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style="font-weight: bold; text-align:right">H Total:</td>
                    <td style="font-weight: bold; text-align:right">{{ number_format($receiptHeadData->sum(function($data) { return $data['total_amount']; }), 2) }}</td>
                </tr>
            @endforeach
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bold; text-align:right">TOTAL:</td>
                <td style="font-weight: bold; text-align:right">{{number_format($TOTAL,2)}}</td>
            </tr>
        </tbody>
    </table>

</body>


</html>

