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
        }
        table, th, td {
        border: 1px solid black;
        }
         th, td {
            padding:5px;
            margin: 5px;
        }
    </style>
</head>
<body>
     <h4 style="margin:0px; padding:0px;">श्री गणेश मंदिर संस्थान - सर्व पावत्या</h4>
     <p style="border: 1px solid black; width:100%; margin:0px; padding:0px; margin-bottom:5px;"></p>
     <table style="width: 100%">
        <tr>
          <th>Receipt No</th>
          <th>Receipt Date</th>
          <th>Receipt Type</th>
          <th>Name</th>
          <th>Mode</th>
          <th>Amount</th>
        </tr>
        <tr>
            <td>{{$receipt->receipt_no}}</td>
            <td>{{ \Carbon\Carbon::parse($receipt->receipt_date)->format('d/m/Y') }}</td>
            <td>{{$receipt->receiptType->receipt_type}}</td>
            <td>{{$receipt->name}}</td>
            <td>{{$receipt->payment_mode}}</td>
            <td>{{$receipt->amount}}</td>
          </tr>
      </table>
</body>
</html>