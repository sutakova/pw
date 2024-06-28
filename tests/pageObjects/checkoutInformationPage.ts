import { type Locator, type Page } from '@playwright/test';
import { URLPaths } from '../support/enums';

export class CheckoutInformationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipInput: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.zipInput = page.getByPlaceholder('Zip/Postal Code');
    this.cancelButton = page.getByRole('button', {name: 'Cancel'});
    this.continueButton = page.getByRole('button', {name: 'Continue'});
  }

  async goto() {
    await this.page.goto(URLPaths.checkoutStepOne);
  }

  async fillIn(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
  }

  async clickButton(button: 'cancel'| 'continue'){
    await this[`${button}Button`].click();
  }
}