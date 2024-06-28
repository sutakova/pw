import { type Locator, type Page, expect } from '@playwright/test';
import { URLPaths } from '../support/enums';
import { CartIcon } from './components/cartIcon';

export class Cart {
    readonly page: Page;
    
    readonly continueShopping: Locator;
    readonly checkout: Locator;
    readonly qtyLabel: Locator;
    readonly descriptionLabel: Locator;
    //item
    readonly item: Locator;
    readonly itemPrice: Locator;
    readonly itemDescription: Locator;
    readonly itemTitle: Locator;
    readonly itemQty: Locator;
    readonly itemAddToCartButton: Locator;

    readonly cartIcon: CartIcon;
    readonly menu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.itemPrice = page.getByTestId('inventory-item-price');
        this.itemDescription = page.getByTestId('inventory-item-desc');
        this.itemTitle = page.getByTestId('inventory-item-name');
        this.itemQty = page.getByTestId('item-quantity');
        this.itemAddToCartButton = page.locator('.btn');

        this.continueShopping = page.getByTestId('continue-shopping');
        this.checkout = page.getByTestId('checkout');
        this.menu = page.getByText('Open Menu');
        this.cartIcon = new CartIcon(page);
    }

    //assertions
    async assertPage() {
        await expect(this.itemAddToCartButton.nth(0)).toHaveText('Remove');
        await expect(this.itemDescription.nth(0)).toBeVisible();
        await expect(this.itemQty.nth(0)).toBeVisible();
        await expect(this.itemPrice.nth(0)).toBeVisible();
        await expect(this.itemTitle.nth(0)).toHaveText('1');

        await expect(this.continueShopping).toBeVisible();
        await expect(this.checkout).toBeVisible();
        await expect(this.cartIcon.shoppingCartBadge).not.toBeVisible();
        await expect(this.menu).toBeVisible();
        this.cartIcon.assertIcon();
    }

    async assertItemsInCart(numberOfItems: number) {
        if (numberOfItems === 0) {
            await expect(this.cartIcon.shoppingCartBadge).not.toBeVisible();
        } else {
            await expect(this.cartIcon.shoppingCartBadge).toHaveText(`${numberOfItems}`);
            await expect(this.itemAddToCartButton).toHaveText("Remove");
        }
    }

    //interactions
    async goto() {
        await this.page.goto(`${URLPaths.cartPage}`);
    }

    async goToMainPage() {
        await this.continueShopping.click();
    }

    async goToCheckout() {
        await this.checkout.click();
    }

    async goToItem(itemTitle: string) {
        await this.itemTitle.filter({ hasText: itemTitle }).click();
    }

    async clickButton() {
        await this.itemAddToCartButton.click();
    }
}