<?php

declare(strict_types=1);

use App\Models\Profile;

it('selects a profile and opens the profile list', function (): void {
    $profile = Profile::factory()->create(['name' => 'Alice']);

    $this->post(route('session.profile', $profile))
        ->assertRedirect(route('profiles.show', $profile))
        ->assertSessionHas('active_profile_id', $profile->id);
});

it('allows guest access to the profiles index', function (): void {
    $this->post(route('session.guest'), ['guest_name' => 'Camille'])
        ->assertRedirect(route('profiles.index'))
        ->assertSessionHas('guest_name', 'Camille');
});

it('redirects list access when no profile or guest session exists', function (): void {
    $profile = Profile::factory()->create();

    $this->get(route('profiles.show', $profile))
        ->assertRedirect(route('home'));
});
