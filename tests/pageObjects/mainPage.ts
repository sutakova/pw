import { type Locator, type Page, expect } from '@playwright/test';
import { URLPaths } from '../support/enums';
import { CartIcon } from './components/cartIcon';

export class MainPage {
    readonly page: Page;
    //item
    readonly item: Locator;
    readonly itemPrice: Locator;
    readonly itemDescription: Locator;
    readonly itemTitle: Locator;
    readonly itemImage: Locator;
    readonly itemAddToCartButton: Locator;

    readonly sortingDropdown: Locator;
    readonly cartIcon: CartIcon;
    readonly menu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.item = page.getByTestId('inventory-item');
        this.itemPrice = page.getByTestId('inventory-item-price');
        this.itemDescription = page.getByTestId('inventory-item-desc');
        this.itemTitle = page.getByTestId('inventory-item-name');
        this.itemImage = page.locator('.inventory_item_img');
        this.itemAddToCartButton = page.locator('.btn');

        this.sortingDropdown = page.getByTestId('product-sort-container');
        this.menu = page.getByText('Open Menu');
        this.cartIcon = new CartIcon(page);
    }

    //assertions
    async assertPage() {
        await expect(this.item.nth(0)).toBeVisible();
        await expect(this.itemAddToCartButton.nth(0)).toHaveText('Add to cart');
        await expect(this.itemDescription.nth(0)).toBeVisible();
        await expect(this.itemImage.nth(0)).toBeVisible();
        await expect(this.itemPrice.nth(0)).toBeVisible();
        await expect(this.itemTitle.nth(0)).toBeVisible();

        await expect(this.sortingDropdown).toBeVisible();
        await expect(this.cartIcon.shoppingCartBadge).not.toBeVisible();
        await expect(this.menu).toBeVisible();
        this.cartIcon.assertIcon();
    }

    async assertItemsInCart(itemNumber: number, numberOfItems: number, text: 'Remove' | 'Add to cart') {
        await expect(this.itemAddToCartButton.nth(itemNumber)).toHaveText(text);
        if (numberOfItems === 0) {
            await expect(this.cartIcon.shoppingCartBadge).not.toBeVisible();
        } else {
            await expect(this.cartIcon.shoppingCartBadge).toHaveText(`${numberOfItems}`);
        }
    }

    //interactions
    async goto() {
        await this.page.goto(URLPaths.mainPage);
    }

    async goToItem(itemTitle: string) {
        await this.itemTitle.filter({ hasText: itemTitle }).click();
    }

    async clickButton(itemNumber: number) {
        await this.itemAddToCartButton.nth(itemNumber).click();
    }
}