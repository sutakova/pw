import { type Locator, type Page } from '@playwright/test';
import { URLPaths } from '../support/enums';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly backHomeButton: Locator;
  readonly thankYouHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backHomeButton = page.getByTestId('back-to-products');
    this.thankYouHeader = page.getByTestId('complete-header');
  }

  async assertPage() {
    await this.backHomeButton.isVisible();
    await this.thankYouHeader.isVisible();
  }

  async goto() {
    await this.page.goto(URLPaths.checkoutComplete);
  }

  async clickButton() {
    await this.backHomeButton.click();
  }
}