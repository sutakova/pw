import { type Locator, type Page, expect } from '@playwright/test';
import { URLPaths } from '../support/enums';
import exp from 'constants';
import { CartIcon } from './components/cartIcon';

export class CheckoutOverviewPage {
    readonly page: Page;
    //item
    readonly cancelButton: Locator;
    readonly finishButton: Locator;
    readonly qtyLabel: Locator;
    readonly descriptionLabel: Locator;

    readonly item: Locator;
    readonly itemPrice: Locator;
    readonly itemDescription: Locator;
    readonly itemTitle: Locator;
    readonly itemQty: Locator;

    readonly cartIcon: CartIcon;
    readonly menu: Locator;

    //payment information
    readonly paymentInformationLabel: Locator;
    readonly shippingInformationLabel: Locator;
    readonly priceTotalInformationLabel: Locator;

    readonly sauceCard: Locator;
    readonly shippingType: Locator;
    readonly itemTotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;

    constructor(page: Page) {
        this.page = page;
        this.itemPrice = page.getByTestId('inventory-item-price');
        this.itemDescription = page.getByTestId('inventory-item-desc');
        this.itemTitle = page.getByTestId('inventory-item-name');
        this.itemQty = page.getByTestId('item-quantity');

        this.paymentInformationLabel = page.getByTestId('payment-info-label');
        this.shippingInformationLabel = page.getByTestId('shipping-info-label');
        this.priceTotalInformationLabel = page.getByTestId('total-info-label');

        this.sauceCard = page.getByTestId('payment-info-value');
        this.shippingType = page.getByTestId('shipping-info-value');
        this.itemTotal = page.getByTestId('subtotal-label');
        this.tax = page.getByTestId('tax-label');
        this.total = page.getByTestId('total-label');

        this.finishButton = page.getByTestId('finish');
        this.cancelButton = page.getByTestId('cancel');
        this.menu = page.getByText('Open Menu');
        this.cartIcon = new CartIcon(page);
    }

    //assertions
    async assertPage() {
        await expect(this.itemDescription.nth(0)).toBeVisible();
        await expect(this.itemQty.nth(0)).toBeVisible();
        await expect(this.itemPrice.nth(0)).toBeVisible();
        await expect(this.itemTitle.nth(0)).toBeVisible();

        await expect(this.paymentInformationLabel).toHaveText('Payment Information:');
        await expect(this.shippingInformationLabel).toHaveText('Shipping Information:');
        await expect(this.priceTotalInformationLabel).toHaveText('Price Total');

        await expect(this.sauceCard).toBeVisible();
        await expect(this.shippingType).toBeVisible();
        await expect(this.itemTotal).toBeVisible();
        await expect(this.tax).toBeVisible();
        await expect(this.total).toBeVisible();

        await expect(this.finishButton).toBeVisible();
        await expect(this.cancelButton).toBeVisible();
        await expect(this.menu).toBeVisible();
        this.cartIcon.assertIcon();
    }
    //check if price total is the same as product price
    async assertPrice() {
        const totalPrice = await this.itemTotal.innerText();
        const itemPrice = await this.itemPrice.innerText();
        const regex = /\$\d+\.\d{2}/;
        const matchResult = totalPrice.match(regex);
        if (matchResult) {
            const price = matchResult[0];
            expect(price).toBe(itemPrice);
        }
    }

    //interactions
    async goto() {
        await this.page.goto(`${URLPaths.checkoutStepTwo}`);
    }

    async clickButton(button: 'cancel' | 'finish') {
        await this[`${button}Button`].click();
    }

    async goToItem(itemTitle: string) {
        await this.itemTitle.filter({ hasText: itemTitle }).click();
    }
}