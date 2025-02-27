<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
    
    body, div, p, h3, h4 {
        margin: 0;
        padding: 0;
        line-height: 2;
    }
    body {
        font-family: "freeserif";
        margin-bottom: 50px;
    }
   
    </style>
</head>

<body>
  
    @foreach($poojaTypeAndGotraCounts as $poojaType => $gotraGroup)
    <div style="width:100% margin-top:5px; padding:0px">
        <h3>{{ $poojaType }}</h3>
    </div>

    @foreach($gotraGroup as $gotra => $items)
        <div style="margin:0px; padding:0px; border-bottom: 1px solid gray;">
            <h4>गोत्र: {{ $gotra }}</h4>
            <div style="margin:0px; padding:0px">
                @foreach($items as $item)
                    <p>{{ $item['name'] }}</p> <!-- Print the name here -->
                @endforeach
            </div>
            <p>एकुण: {{ $items->count() }}</p>
          
        </div>
    @endforeach
    @php
    $totalNamesForPoojaType = $gotraGroup->flatMap(function($gotraGroupItems) {
        return $gotraGroupItems->pluck('name'); // Collect names from all gotra groups
    })->count();
@endphp
     <h4 style=" margin:10px 0px 15px; 0px;">एकुण {{$poojaType}}: {{$totalNamesForPoojaType}} </h4>
@endforeach

<div style="margin:0px; padding:0px; border-bottom: 1px solid gray;">
   
</div>

<div style="margin:0px; padding:0px; border-bottom: 1px solid gray;">
    <h4>साडी</h4>
    <div style="margin:0px; padding:0px">
            <p>{{@$sareeReceipt->name}}</p> 
    </div>  
</div>

<div style="margin:0px; padding:0px; border-bottom: 1px solid gray;">
    <h4>उपरणे</h4>
    <div style="margin:0px; padding:0px">
            <p>{{@$uparaneReceipt->name}}</p> 
    </div>  
</div>
    </body>

</html>