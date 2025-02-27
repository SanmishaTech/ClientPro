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
                <th>Receipt Type</th>
                <th>Bank</th>
                <th>UPI</th>
                <th>Cash</th>
                <th>Card</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($receiptsWithTotal as $receiptHead => $receiptHeadData)
                <!-- Display Receipt Head Title -->
                <tr>
                    <td colspan="6" style="font-weight: bold;">{{ $receiptHead }}</td>
                </tr>

                {{-- Loop through each receiptType within the current receiptHead --}}
                @foreach($receiptHeadData as $receiptTypeId => $data)
                    <tr>
                        <td>{{ $data['receipts']->first()->receiptType->receipt_type ?? 'N/A' }}</td>
                        <td style="text-align:right">{{ number_format($data['total_bank'], 2) }}</td>
                        <td style="text-align:right">{{ number_format($data['total_upi'], 2) }}</td>
                        <td style="text-align:right">{{ number_format($data['total_cash'], 2) }}</td>
                        <td style="text-align:right">{{ number_format($data['total_card'], 2) }}</td>
                        <td style="text-align:right">{{ number_format($data['total_amount'], 2) }}</td>
                    </tr>
                @endforeach

                <!-- Display calculated totals for the entire receiptHead -->
                <tr>
                    <td style="font-weight: bold; text-align:right">H Total:</td>
                    <td style="font-weight: bold; text-align:right">{{ number_format($receiptHeadData->sum(function($data) { return $data['total_bank']; }), 2) }}</td>
                    <td style="font-weight: bold; text-align:right">{{ number_format($receiptHeadData->sum(function($data) { return $data['total_upi']; }), 2) }}</td>
                    <td style="font-weight: bold; text-align:right">{{ number_format($receiptHeadData->sum(function($data) { return $data['total_cash']; }), 2) }}</td>
                    <td style="font-weight: bold; text-align:right">{{ number_format($receiptHeadData->sum(function($data) { return $data['total_card']; }), 2) }}</td>
                    <td style="font-weight: bold; text-align:right">{{ number_format($receiptHeadData->sum(function($data) { return $data['total_amount']; }), 2) }}</td>
                </tr>

            @endforeach
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bold;" colspan="2">Cash Total:</td>
                <td style="font-weight: bold;  text-align: right;" >{{$cashTotal}}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bold;" colspan="2">UPI Total:</td>
                <td style="font-weight: bold;  text-align: right;" >{{$upiTotal}}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bold;" colspan="2">Cheque Total:</td>
                <td style="font-weight: bold; text-align: right;" >{{$chequeTotal}}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bold;" colspan="2">Card Total:</td>
                <td style="font-weight: bold; text-align: right;" >{{$cardTotal}}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="font-weight: bold;" colspan="2">TOTAL:</td>
                <td style="font-weight: bold; text-align: right;" >{{$Total}}</td>
            </tr>
        </tbody>
    </table>

</body>


</html>

