<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSurahModalTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_fetch_surah_form_payload_via_json(): void
    {
        $this->seed();
        $user = User::first();

        $response = $this->actingAs($user)->getJson(route('admin.surahs.create'));

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'number',
                'name_ar',
                'name_en',
                'slug',
                'meta',
            ],
        ]);
    }

    /** @test */
    public function admin_can_create_surah_through_json_modal(): void
    {
        $this->seed();
        $user = User::first();

        $payload = [
            'number' => 1,
            'name_ar' => '???????',
            'name_en' => 'Al-Fatiha',
            'slug' => null,
            'revelation_type' => 'meccan',
            'summary' => 'Opening chapter.',
            'meta' => [
                'name_bn' => '???? ??-??????',
                'meaning_bn' => '?????',
                'summary_bn' => '??????????? ?????',
                'revelation_order' => 5,
            ],
        ];

        $response = $this->actingAs($user)->postJson(route('admin.surahs.store'), $payload);

        $response->assertCreated();
        $response->assertJsonPath('data.name_en', 'Al-Fatiha');

        $this->assertDatabaseHas('surahs', [
            'number' => 1,
            'slug' => 'al-fatiha',
        ]);
    }
}
