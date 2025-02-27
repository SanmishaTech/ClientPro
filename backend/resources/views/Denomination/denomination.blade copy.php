<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
        font-family: 'Noto Sans Devanagari', sans-serif; /* Use the correct font family */
    }

    h1 {
        font-family: 'Noto Sans Devanagari', sans-serif; /* Ensure this is applied to headings too */
    }
  </style>
</head>
<body>
  <h1 style=" text-align: center;">श्री गणेश मंदिर संस्थान - नोट विवरण तख्ता {{ \Carbon\Carbon::parse($denomination->deposit_date)->format('d/m/Y') }}</h1>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
        <td style="width: 50%; vertical-align: top;">
            <table style="width: 100%; border: 1px solid black; border-collapse: collapse;">
                <tr>
                    <th colspan="2" style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; background:#d4d5d7">Notes </th>
                </tr>
                <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 2000 x {{$denomination->n_2000}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(2000 * $denomination->n_2000,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 500 x {{$denomination->n_500}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(500 * $denomination->n_500,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 200 x {{$denomination->n_200}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(200 * $denomination->n_200,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 100 x {{$denomination->n_100}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(100 * $denomination->n_100,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 50 x {{$denomination->n_50}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(50 * $denomination->n_50,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 20 x {{$denomination->n_20}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(20 * $denomination->n_20,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 10 x {{$denomination->n_10}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(10 * $denomination->n_10,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:22px 4px 22px 4px; font-size:20px;"></td>
                    <td style="border: 1px solid black; padding:22px 4px 22px font-size:20px; text-align:right"></td>
                </tr>
            </table>
        </td>
        <td style="width: 50%; vertical-align: top;">
            <table style="width: 100%; border: 1px solid black; border-collapse: collapse;">
                <tr>
                    <th colspan="2" style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; background:#d4d5d7">Coins</th>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 20 x {{$denomination->c_20}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(20 * $denomination->c_20,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 10 x {{$denomination->c_10}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(10 * $denomination->c_10,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 5 x {{$denomination->c_5}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(5 * $denomination->c_5,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 2 x {{$denomination->c_2}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(2 * $denomination->c_2,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px;">Rs. 1 x {{$denomination->c_1}}</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{number_format(1 * $denomination->c_1,2)}}</td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:22px 4px 22px 4px; font-size:20px;"></td>
                    <td style="border: 1px solid black; padding:22px 4px 22px 4px; font-size:20px; text-align:right"></td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:22px 4px 22px 4px; font-size:20px;"></td>
                    <td style="border: 1px solid black; padding:22px 4px 22px 4px; font-size:20px; text-align:right"></td>
                </tr>
                 <tr>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">Total:</td>
                    <td style="border: 1px solid black; padding:10px 4px 10px 4px; font-size:20px; text-align:right">{{$denomination->amount}}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
{{-- fefe --}}