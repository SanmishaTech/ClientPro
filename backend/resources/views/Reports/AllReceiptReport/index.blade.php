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
            <th>Receipt Type</th>
            <th>Name</th>
            @if($receiptHead == "वस्तुरुपी देणगी")
            <th>Narration</th>
            @endif
            <th>Mode</th>
            <th>Amount</th>
        </tr>
    </thead>
        <tbody>
            @foreach($receipts as $receipt)
            <tr>
                <td @if($receipt->cancelled == true) style="text-decoration:line-through" @endif >{{$receipt->receipt_no}}</td>
                <td @if($receipt->cancelled == true) style="text-decoration:line-through" @endif>{{ \Carbon\Carbon::parse($receipt->receipt_date)->format('d/m/Y') }}</td>
                <td @if($receipt->cancelled == true) style="text-decoration:line-through" @endif>{{$receipt->receiptType->receipt_type}}</td>
                <td @if($receipt->cancelled == true) style="text-decoration:line-through" @endif>{{$receipt->name}}</td>
                @if($receiptHead == "वस्तुरुपी देणगी")
                <td @if($receipt->cancelled == true) style="text-decoration:line-through" @endif>{{$receipt->narration}}</td>
                @endif
                <td @if($receipt->cancelled == true) style="text-decoration:line-through" @endif>{{$receipt->payment_mode}}</td>
                <td @if($receipt->cancelled == true) style="text-decoration:line-through; text-align: right;"@else style="text-align: right;" @endif >{{$receipt->amount}}</td>
            </tr>
            @endforeach
             <tr>
                <td></td>
                <td></td>
                <td></td>
                @if($receiptHead == "वस्तुरुपी देणगी")
                <td></td>
                @endif
                <td style="font-weight: bold;" colspan="2">Cash Total:</td>
                <td style="font-weight: bold;  text-align: right;" >{{$cashTotal}}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                @if($receiptHead == "वस्तुरुपी देणगी")
                <td></td>
                @endif
                <td style="font-weight: bold;" colspan="2">UPI Total:</td>
                <td style="font-weight: bold;  text-align: right;" >{{$upiTotal}}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                @if($receiptHead == "वस्तुरुपी देणगी")
                <td></td>
                @endif
                <td style="font-weight: bold;" colspan="2">Cheque Total:</td>
                <td style="font-weight: bold; text-align: right;" >{{$chequeTotal}}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                @if($receiptHead == "वस्तुरुपी देणगी")
                <td></td>
                @endif
                <td style="font-weight: bold;" colspan="2">Card Total:</td>
                <td style="font-weight: bold; text-align: right;" >{{$cardTotal}}</td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                @if($receiptHead == "वस्तुरुपी देणगी")
                <td></td>
                @endif
                <td style="font-weight: bold;" colspan="2">TOTAL:</td>
                <td style="font-weight: bold; text-align: right;" >{{$Total}}</td>
            </tr>
        </tbody>

    </table>
    

    </body>



</html>