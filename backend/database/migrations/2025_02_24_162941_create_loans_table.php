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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id'); 
            $table->unsignedBigInteger('family_member_id')->nullable(); 
            $table->string("bank_name",100)->nullable();
            $table->string("loan_type",100)->nullable();
            $table->date("start_date")->nullable();
            $table->date("end_date")->nullable();
            $table->decimal("loan_amount",10,2)->nullable();
            $table->string("term")->nullable();
            $table->decimal("emi",10,2)->nullable();
            $table->decimal("roi",10,2)->nullable();
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
        Schema::dropIfExists('loans');
    }
};