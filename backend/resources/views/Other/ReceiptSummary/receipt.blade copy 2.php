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
@foreach($receiptsWithTotal as $receiptHead => $data)
   
        <tbody>
            <!-- Display Receipt Head Title -->
            <tr>
                <td colspan="6" style="font-weight: bold;">{{ $receiptHead }}</td>
            </tr>

            {{-- Loop through receipts and display them --}}
            {{-- @foreach($data['receipts'] as $receipt) --}}
                <tr>
                    <td>{{  $data['receipts'][0]->receiptType->receipt_type ?? 'N/A'}}</td>
                    {{-- <td>{{ $receipt->payment_mode == 'Bank' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                    <td>{{ $receipt->payment_mode == 'Cash' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                    <td>{{ $receipt->payment_mode == 'Card' ? number_format($receipt->amount, 2) : '0.00' }}</td>
                    <td>{{ number_format($receipt->amount, 2) }}</td> --}}
                    <td style="text-align:right">{{ number_format($data['total_bank'], 2) }}</td>
                    <td style="text-align:right">{{ number_format($data['total_upi'], 2) }}</td>
                    <td style="text-align:right">{{ number_format($data['total_cash'], 2) }}</td>
                    <td style="text-align:right">{{ number_format($data['total_card'], 2) }}</td>
                    <td style="text-align:right">{{ number_format($data['total_amount'], 2) }}</td>
                </tr>
            {{-- @endforeach --}}

            <!-- Display calculated totals -->
            <tr>
                <td style="font-weight: bold; text-align:right">H Total:</td>
                <td style="font-weight: bold; text-align:right">{{ number_format($data['total_bank'], 2) }}</td>
                <td style="font-weight: bold; text-align:right">{{ number_format($data['total_upi'], 2) }}</td>
                <td style="font-weight: bold; text-align:right">{{ number_format($data['total_cash'], 2) }}</td>
                <td style="font-weight: bold; text-align:right">{{ number_format($data['total_card'], 2) }}</td>
                <td style="font-weight: bold; text-align:right">{{ number_format($data['total_amount'], 2) }}</td>
            </tr>

        </tbody>

   
        @endforeach

    </table>


    </body>



</html>

