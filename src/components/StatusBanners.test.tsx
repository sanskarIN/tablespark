import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PWA_OFFLINE_READY_EVENT,
  PWA_UPDATE_AVAILABLE_EVENT,
  type PwaUpdateAvailableDetail,
} from '../infrastructure/pwaEvents';
import { AppStateProvider } from '../state/AppStateProvider';
import { StatusBanners } from './StatusBanners';

function renderBanners() {
  return render(
    <AppStateProvider>
      <StatusBanners />
    </AppStateProvider>,
  );
}

describe('PWA status banners', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('tablespark.onboarding.dismissed.v1', 'true');
  });

  it('offers an explicit update action without applying it automatically', async () => {
    const user = userEvent.setup();
    const update = vi.fn(async (_reloadPage?: boolean) => undefined);
    renderBanners();

    window.dispatchEvent(
      new CustomEvent<PwaUpdateAvailableDetail>(PWA_UPDATE_AVAILABLE_EVENT, {
        detail: { update },
      }),
    );

    expect(await screen.findByText('A TableSpark update is ready.')).toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Update now' }));
    expect(update).toHaveBeenCalledWith(true);
  });

  it('lets the user defer an available update', async () => {
    const user = userEvent.setup();
    const update = vi.fn(async (_reloadPage?: boolean) => undefined);
    renderBanners();

    window.dispatchEvent(
      new CustomEvent<PwaUpdateAvailableDetail>(PWA_UPDATE_AVAILABLE_EVENT, {
        detail: { update },
      }),
    );

    await user.click(await screen.findByRole('button', { name: 'Later' }));
    expect(screen.queryByText('A TableSpark update is ready.')).not.toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
  });

  it('announces when the current app shell is ready for offline use', async () => {
    const user = userEvent.setup();
    renderBanners();

    window.dispatchEvent(new Event(PWA_OFFLINE_READY_EVENT));
    expect(await screen.findByText('Offline use is ready.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Offline use is ready.')).not.toBeInTheDocument();
  });
});
