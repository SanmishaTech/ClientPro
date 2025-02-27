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
  
    {{-- <h4 style="margin:0px; padding:0px;">श्री गणेश मंदिर संस्थान - सर्व पावत्या {{ \Carbon\Carbon::parse($from_date)->format('d/m/Y') }} ते {{ \Carbon\Carbon::parse($to_date)->format('d/m/Y') }}</h4>
    <p style="border: 1px solid black; width:100%; margin:0px; padding:0px; margin-bottom:5px;"></p> --}}
    <table style="width: 100%">
        <thead>
        <tr>
            <th>Receipt No</th>
            <th>Receipt Date</th>
            <th>Name</th>
            <th>Mode</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
        </tr>
    </thead>
        <tbody>
            @foreach($receipts as $receipt)
            <tr>
                <td>{{$receipt->receipt_no}}</td>
                <td>{{ \Carbon\Carbon::parse($receipt->receipt_date)->format('d/m/Y') }}</td>
                <td>{{$receipt->name}}</td>
                <td>{{$receipt->payment_mode}}</td>
                <td>{{@$receipt->khatReceipt->quantity}}</td>
                <td>{{@$receipt->khatReceipt->rate}}</td>
                <td style="text-align: right;">{{$receipt->amount}}</td>
            </tr>
            @endforeach
             <tr>
                <td></td>
                <td></td>
                <td colspan="4" style="font-weight: bold;" colspan="2">Total:</td>
                <td>{{$totalQuantity}}</td>
                <td></td>
                <td style="font-weight: bold;  text-align: right;" >{{$total}}</td>
            </tr>
         
        </tbody>

    </table>
    

    </body>



</html>