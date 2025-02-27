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
        position: relative; 
        /* width: 100%; 
        height: 100%; */
        padding: 0;
        /* background: red; */
    }
    /* table {
            width: 100%; 
            border-spacing: 0;
        } */

        /* td {
            padding: 5px;
        } */

        /* .receipt-container {
            width: 100%;
        } */

        /* .receipt-no {
            padding: 5px;
        } */
        .bottom-text {
            position: absolute;
            bottom: 1.5cm; /* Position the text at the very bottom */
            width: 100%;
            /* text-align: ; */
            /* padding: 20px 0; Adjust this padding to match your desired margin */
            padding-left:80px;
            margin-bottom: 0; 
        }
    </style>
</head>
<body>
    
        <h4 style="font-weight: bold; text-align:center">{{$receipt->receiptType->receipt_type}}</h4>
        <table style=" width: 100%; border-spacing: 0;">
            <tr>
                <td style=" padding: 5px;">{{$receipt->receipt_no}}</td>
                <td style="text-align:right">{{\Carbon\Carbon::parse($receipt->receipt_date)->format('d/m/Y')}}</td>
            </tr>
        </table>

        <p style="padding: 1 0 0 0 ; margin:0;">{{$receipt->name}}</p>
        <p style="padding: 1 0 0 0 ; margin:0; font-size:10px;">{{@$receipt->address}}</p>

        <table style="width: 100%; margin-top:30px; border-spacing: 0;">
            <tr>
                @if(@$receipt->sareeReceipt->saree_draping_date_morning)
                <td style=" padding: 5px;">साडी नेसविन्याचा दिनांक सकाळी: {{\Carbon\Carbon::parse(@$receipt->sareeReceipt->saree_draping_date_morning)->format('d/m/Y')}}</td>
                @else
                <td></td>
                @endif
                <td style="text-align:right">{{$receipt->amount}}</td>
            </tr>
        </table>
        @if(@$receipt->sareeReceipt->saree_draping_date_evening)
        <p style="margin:0;">साडी नेसविन्याचा दिनांक सांध्याकाळी: {{\Carbon\Carbon::parse(@$receipt->sareeReceipt->saree_draping_date_evening)->format('d/m/Y')}}</p>
        @endif

        @if(@$receipt->sareeReceipt->return_saree)
        <p style="margin:0; font-size:12px;">प्रसादाची साडी परत हवी आहे</p>
        <p style="margin:0; font-size:12px;">टिप: प्रसादाची साडी नेसविलेल्या दिवसापासून १५ दिवसांच्या आत संबंधितांनी घेतून जावी. नंतर मंदिर जबाबदार राहणार नाही.</p>
        @else
        <p style="margin:0; font-size:12px;">प्रसादाची साडी परत नको</p>
        @endif
        <p style="margin:0;">{{@$receipt->narration}}</p>


        @if(@$receipt->special_date)
        <p style="padding-top: 0; margin:0;">दिनांक: {{\Carbon\Carbon::parse(@$receipt->special_date)->format('d/m/Y')}}</p>
          @endif

          @if(@$receipt->remembrance)
          <p style="padding-top: 0; margin-bottom:0; margin-top:0; font-size:12px;">{{@$receipt->remembrance}}</p>
            @endif

          @if(@$receipt->payment_mode == "Bank")
          <p style="margin-top:2px;">
            <p style="padding: 0; margin:0; font-size:10px;">बँकेचे नाव: {{@$receipt->bank_details}}</p>
            <p style="padding: 0; margin:0; font-size:10px;">धनादेश क्र: {{@$receipt->cheque_number}}</p>
            <p style="padding: 0; margin:0; font-size:10px;">धनादेश दिनांक:  @if($receipt->cheque_date)
                {{ \Carbon\Carbon::parse($receipt->cheque_date)->format('d/m/Y') }}
            @else
                N/A  <!-- or any default text you want to display when the date is not available -->
            @endif
        </p>
            <p style="padding: 0; margin:0; font-size:10px;">Cheques are subjected to realization.</p>
          </p>
          @elseif(@$receipt->payment_mode == "UPI")
          <p style="margin-top:2px;">
          <p style="padding: 0; margin:0; font-size:10px;">यू.टी.आर क्र: {{@$receipt->upi_number}}</p>
          </p>
          @endif

          <div style="position: absolute; bottom:3.1cm;">
            <table style=" width: 90%; border-spacing: 0;">
                <tr>
                    <td style=" padding: 5px;">{{$receipt->amount_in_words}}</td>
                    <td style="text-align:right">{{$receipt->amount}}</td>
                </tr>
            </table>
        </div>

        <p class="bottom-text">: {{$receipt->profile->profile_name}}&nbsp;&nbsp;&nbsp;{{ \Carbon\Carbon::parse($receipt->created_at)->format('d/m/Y h:i A') }}</p>


</body>
</html>