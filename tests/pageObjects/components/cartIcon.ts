import { type Locator, type Page, expect } from '@playwright/test';

export class CartIcon {
    readonly page: Page;

    readonly cartIcon: Locator;
    readonly shoppingCartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartIcon = page.getByTestId('shopping-cart-link');
        this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    }

    //assertions
    async assertIcon() {
        await expect(this.cartIcon).toBeVisible();
    }

    async assertItemsInCart(numberOfItems: number) {
        if (numberOfItems === 0) {
            await expect(this.shoppingCartBadge).not.toBeVisible();
        } else {
            await expect(this.shoppingCartBadge).toHaveText(`${numberOfItems}`);
        }
    }

    //interactions
    async goToCart() {
        await this.cartIcon.click();
    }
}