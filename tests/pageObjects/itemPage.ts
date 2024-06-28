import { type Locator, type Page, expect } from '@playwright/test';
import { URLPaths } from '../support/enums';
import { CartIcon } from './components/cartIcon';

export class ItemPage {
    readonly page: Page;
    //item
    readonly backToProducts: Locator;
    readonly itemPrice: Locator;
    readonly itemDescription: Locator;
    readonly itemTitle: Locator;
    readonly itemImage: Locator;
    readonly itemAddToCartButton: Locator;

    readonly cartIcon: CartIcon;
    readonly menu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backToProducts = page.getByTestId('back-to-products');
        this.itemPrice = page.getByTestId('inventory-item-price');
        this.itemDescription = page.getByTestId('inventory-item-desc');
        this.itemTitle = page.getByTestId('inventory-item-name');
        this.itemImage = page.locator('.inventory_details_img');
        this.itemAddToCartButton = page.locator('.btn');

        this.menu = page.getByText('Open Menu');
        this.cartIcon = new CartIcon(page);
    }

    //assertions
    async assertPage() {
        await expect(this.itemAddToCartButton.nth(1)).toHaveText('Add to cart');
        await expect(this.itemDescription.nth(0)).toBeVisible();
        await expect(this.itemImage.nth(0)).toBeVisible();
        await expect(this.itemPrice.nth(0)).toBeVisible();
        await expect(this.itemTitle.nth(0)).toBeVisible();

        await expect(this.cartIcon.shoppingCartBadge).not.toBeVisible();
        await expect(this.menu).toBeVisible();
        this.cartIcon.assertIcon();
    }

    async assertItemsInCart(numberOfItems: number, text: 'Remove' | 'Add to cart') {
        await expect(this.itemAddToCartButton.nth(1)).toHaveText(text);
        if (numberOfItems === 0) {
            await expect(this.cartIcon.shoppingCartBadge).not.toBeVisible();
        } else {
            await expect(this.cartIcon.shoppingCartBadge).toHaveText(`${numberOfItems}`);
        }
    }

    //interactions
    async goto(itemId: number) {
        await this.page.goto(`${URLPaths.itemPage}?id=${itemId}`);
    }

    async goToMainPage() {
        await this.backToProducts.click();
    }

    async clickButton() {
        await this.itemAddToCartButton.nth(1).click();
    }
}