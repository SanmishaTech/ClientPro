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
        Schema::create('mutual_funds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id'); 
            $table->unsignedBigInteger('family_member_id')->nullable(); 
            $table->string("mutual_fund_name")->nullable();
            $table->string('account_number')->nullable();
            $table->string('service_provider')->nullable();
            $table->date('start_date')->nullable();
            $table->string('reference_name')->nullable();
            $table->boolean('cancelled')->default(0);
            $table->unsignedBigInteger('cancelled_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mutual_funds');
    }
};