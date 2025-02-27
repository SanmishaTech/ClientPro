<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('l_i_c_s', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id'); 
            $table->string('company_name', 100)->nullable();
            $table->string('broker_name', 100)->nullable();
            $table->date('proposal_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('premium_payment_mode')->nullable();
            $table->decimal('sum_insured',10,2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('l_i_c_s');
    }
};