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
                <th style="width: 80%;">Pooja Type</th>
                <th>Count</th>
            </tr>
        </thead>
        <tbody>
            {{-- @foreach($receipts as $poojaType)
                <tr>
                    <td>{{ $poojaType }}</td>
                    <td>1</td> <!-- Assuming each Pooja Type occurs once in the report, you can adjust logic if needed -->
                </tr>
            @endforeach --}}
            @foreach($poojaTypeCounts as $poojaType => $count)
            <tr>
                <td>{{ $poojaType }}</td>
                <td style="text-align: right;">{{ $count }}</td> <!-- Display the count of this pooja type -->
            </tr>
        @endforeach

           
            <tr class="">
                <td style="font-weight: bold; text-align: right;">TOTAL:</td>
                <td style="font-weight: bold; text-align: right;">{{ $totalCount }}</td>
            </tr>
        </tbody>
    </table>
    

    </body>



</html>