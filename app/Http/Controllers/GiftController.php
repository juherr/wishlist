<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ResolvesProfiles;
use App\Http\Requests\GiftRequest;
use App\Models\Gift;
use App\Models\Profile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GiftController extends Controller
{
    use ResolvesProfiles;

    public function store(GiftRequest $request, Profile $profile): RedirectResponse
    {
        abort_unless($this->canManageProfile($request, $profile), 403);

        /** @var Gift $gift */
        $gift = $profile->gifts()->create($request->normalized());

        return to_route('profiles.show', $profile)->with('success', "{$gift->title} ajouté.");
    }

    public function update(GiftRequest $request, Profile $profile, Gift $gift): RedirectResponse
    {
        abort_unless($gift->profile()->is($profile), 404);
        abort_unless($this->canManageProfile($request, $profile), 403);

        $gift->update($request->normalized());

        return to_route('profiles.show', $profile)->with('success', "{$gift->title} modifié.");
    }

    public function destroy(Request $request, Profile $profile, Gift $gift): RedirectResponse
    {
        abort_unless($gift->profile()->is($profile), 404);
        abort_unless($this->canManageProfile($request, $profile), 403);

        $gift->delete();

        return to_route('profiles.show', $profile)->with('success', 'Cadeau supprimé.');
    }

    public function reserve(Request $request, Profile $profile, Gift $gift): RedirectResponse
    {
        abort_unless($gift->profile()->is($profile), 404);

        if ($gift->is_list) {
            return to_route('profiles.show', $profile)->with('error', 'Une liste externe ne peut pas être réservée.');
        }

        if ($gift->is_reserved) {
            return to_route('profiles.show', $profile)->with('error', 'Ce cadeau est déjà réservé.');
        }

        $activeProfile = $this->activeProfile($request);
        $guestName = $request->session()->get('guest_name');

        abort_unless($activeProfile || filled($guestName), 403);

        $gift->forceFill([
            'reserved_by_profile_id' => $activeProfile?->id,
            'reserved_by_guest_name' => $activeProfile ? null : $guestName,
            'reserved_at' => now(),
        ])->save();

        return to_route('profiles.show', $profile)->with('success', "{$gift->title} réservé.");
    }

    public function cancelReservation(Request $request, Profile $profile, Gift $gift): RedirectResponse
    {
        abort_unless($gift->profile()->is($profile), 404);

        $activeProfile = $this->activeProfile($request);
        $guestName = $request->session()->get('guest_name');

        $reservedByActiveProfile = $activeProfile && $gift->reserved_by_profile_id === $activeProfile->id;
        $reservedByGuest = filled($guestName) && $gift->reserved_by_guest_name === $guestName;
        $canManage = $this->canManageProfile($request, $profile);

        abort_unless($reservedByActiveProfile || $reservedByGuest || $canManage, 403);

        $gift->forceFill([
            'reserved_by_profile_id' => null,
            'reserved_by_guest_name' => null,
            'reserved_at' => null,
        ])->save();

        return to_route('profiles.show', $profile)->with('success', 'Réservation annulée.');
    }
}
