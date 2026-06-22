<?php

declare(strict_types=1);

use App\Models\Gift;
use App\Models\Profile;

it('allows an owner to create update and delete a gift', function (): void {
    $profile = Profile::factory()->create();

    $this->withSession(['active_profile_id' => $profile->id])
        ->post(route('profiles.gifts.store', $profile), [
            'title' => 'Vélo',
            'description' => 'Rouge',
            'link' => 'https://example.com/bike',
        ])
        ->assertRedirect(route('profiles.show', $profile));

    $gift = Gift::query()->where('title', 'Vélo')->firstOrFail();

    $this->withSession(['active_profile_id' => $profile->id])
        ->put(route('profiles.gifts.update', [$profile, $gift]), [
            'title' => 'Vélo bleu',
            'is_list' => false,
        ])
        ->assertRedirect(route('profiles.show', $profile));

    expect($gift->refresh()->title)->toBe('Vélo bleu');

    $this->withSession(['active_profile_id' => $profile->id])
        ->delete(route('profiles.gifts.destroy', [$profile, $gift]))
        ->assertRedirect(route('profiles.show', $profile));

    expect(Gift::query()->whereKey($gift->id)->exists())->toBeFalse();
});

it('allows profile and guest reservations and cancellations', function (): void {
    $owner = Profile::factory()->create();
    $reserver = Profile::factory()->create();
    $gift = Gift::factory()->for($owner)->create();

    $this->withSession(['active_profile_id' => $reserver->id])
        ->post(route('profiles.gifts.reserve', [$owner, $gift]))
        ->assertRedirect(route('profiles.show', $owner));

    expect($gift->refresh()->reserved_by_profile_id)->toBe($reserver->id);

    $this->withSession(['active_profile_id' => $reserver->id])
        ->delete(route('profiles.gifts.cancel-reservation', [$owner, $gift]))
        ->assertRedirect(route('profiles.show', $owner));

    expect($gift->refresh()->reserved_by_profile_id)->toBeNull();

    $this->flushSession();

    $this->withSession(['guest_name' => 'Morgan'])
        ->post(route('profiles.gifts.reserve', [$owner, $gift]))
        ->assertRedirect(route('profiles.show', $owner));

    expect($gift->refresh()->reserved_by_guest_name)->toBe('Morgan');
});

it('forbids a profile from managing another profile gifts', function (): void {
    $owner = Profile::factory()->create();
    $other = Profile::factory()->create();

    $this->withSession(['active_profile_id' => $other->id])
        ->post(route('profiles.gifts.store', $owner), ['title' => 'Console'])
        ->assertForbidden();
});
