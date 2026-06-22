<?php

declare(strict_types=1);

use App\Models\Profile;

it('creates a child profile with parent relations', function (): void {
    $parent = Profile::factory()->create();

    $this->post(route('profiles.store'), [
        'name' => 'Lou',
        'is_child' => true,
        'avatar' => 3,
        'birthday' => '2020-01-01',
        'parent_ids' => [$parent->id],
    ])->assertRedirect();

    $child = Profile::query()->where('name', 'Lou')->firstOrFail();

    expect($child->is_child)->toBeTrue()
        ->and($child->parents()->whereKey($parent->id)->exists())->toBeTrue();
});

it('allows a parent profile to update a child profile', function (): void {
    $parent = Profile::factory()->create();
    $child = Profile::factory()->child()->create();
    $parent->children()->attach($child);

    $this->withSession(['active_profile_id' => $parent->id])
        ->put(route('profiles.update', $child), [
            'name' => 'Updated child',
            'is_child' => true,
            'avatar' => 4,
            'parent_ids' => [$parent->id],
        ])
        ->assertRedirect(route('profiles.show', $child));

    expect($child->refresh()->name)->toBe('Updated child');
});
