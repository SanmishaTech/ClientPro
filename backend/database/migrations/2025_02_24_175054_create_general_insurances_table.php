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
        Schema::create('general_insurances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id'); 
            $table->unsignedBigInteger('family_member_id')->nullable(); 
            $table->string("insurance_type")->nullable();
            $table->string("company_name")->nullable();
            $table->decimal("premium",10,2)->nullable();
            $table->date("start_date")->nullable();
            $table->date("end_date")->nullable();
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
        Schema::dropIfExists('general_insurances');
    }
};