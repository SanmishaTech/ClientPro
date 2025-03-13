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
       Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('client_name', 100)->nullable();
            $table->string('email', 50)->nullable();
            $table->string('mobile', 15)->nullable();
            $table->string('mobile_2', 15)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('height')->nullable();
            $table->decimal('weight',10,2)->nullable();
            $table->string('existing_ped')->nullable();
            $table->string('residential_address')->nullable();
            $table->integer('residential_address_pincode')->nullable();
            $table->string('office_address')->nullable();
            $table->integer('office_address_pincode')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};