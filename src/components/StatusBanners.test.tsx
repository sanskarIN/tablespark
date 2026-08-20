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

  it('offers installation only when the browser provides an install prompt', async () => {
    const user = userEvent.setup();
    const prompt = vi.fn(async () => undefined);
    renderBanners();

    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt,
    });
    window.dispatchEvent(event);

    expect(await screen.findByText('Install TableSpark on this device.')).toBeInTheDocument();
    expect(prompt).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Install TableSpark' }));
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it('lets the user dismiss the optional install notice', async () => {
    const user = userEvent.setup();
    const prompt = vi.fn(async () => undefined);
    renderBanners();

    window.dispatchEvent(
      Object.assign(new Event('beforeinstallprompt', { cancelable: true }), { prompt }),
    );
    await user.click(await screen.findByRole('button', { name: 'Not now' }));

    expect(screen.queryByText('Install TableSpark on this device.')).not.toBeInTheDocument();
    expect(prompt).not.toHaveBeenCalled();
  });
});
