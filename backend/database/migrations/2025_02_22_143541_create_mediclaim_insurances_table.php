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
        Schema::create('mediclaim_insurances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id'); 
            $table->unsignedBigInteger('family_member_id')->nullable(); 
            $table->string('company_name', 100)->nullable();
            $table->string('broker_name', 100)->nullable();
            $table->string('policy_number', 100)->nullable();
            $table->string('plan_name')->nullable();
            $table->decimal('premium',10,2)->nullable();
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
        Schema::dropIfExists('mediclaim_insurances');
    }
};