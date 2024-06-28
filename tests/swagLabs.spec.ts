import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/loginPage';
import { MainPage } from './pageObjects/mainPage';
import { ItemPage } from './pageObjects/itemPage';
import { CartIcon } from './pageObjects/components/cartIcon';
import { CheckoutInformationPage } from './pageObjects/checkoutInformationPage';
import { CheckoutOverviewPage } from './pageObjects/checkoutOverview';
import { CheckoutCompletePage } from './pageObjects/checkoutComplete';
import { Cart } from './pageObjects/cart';
import { passwords, users } from './support/enums';

test.beforeEach(async ({ page }) => {
    console.log(`Running ${test.info().title}`);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard_user, passwords.standard_user);

    await expect(page).toHaveTitle('Swag Labs');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('add and remove item from cart on main page', async ({ page }) => {
    const mainPage = new MainPage(page);
    const cart = new Cart(page);

    await mainPage.assertPage();

    //add 1st item to cart
    await mainPage.clickButton(0);
    await mainPage.assertItemsInCart(0, 1, 'Remove');
    //remove 1st item from cart
    await mainPage.clickButton(0);
    await mainPage.assertItemsInCart(0, 0, 'Add to cart');
    //check if item is in cart
    await cart.assertItemsInCart(0);
});

[
    { firstName: 'Alice', lastName: 'Smith', zip: '12345' },
    { firstName: 'ابداع کردند.', lastName: 'مدتی بیش', zip: 'qw213' },
    { firstName: '23424', lastName: '=-=-..', zip: 'elfr??' },
].forEach(({ firstName, lastName, zip }) => {
    test(`buy an item as ${firstName}`, async ({ page }) => {
        const mainPage = new MainPage(page);
        const cartIcon = new CartIcon(page);
        const checkoutInformationPage = new CheckoutInformationPage(page);
        const checkoutoverviewPage = new CheckoutOverviewPage(page);
        const chcekoutCompletePage = new CheckoutCompletePage(page);
        const cart = new Cart(page);

        await mainPage.clickButton(0);
        await cartIcon.goToCart();
        await cart.goToCheckout();
        await checkoutInformationPage.fillIn(`${firstName}`, `${lastName}`, `${zip}`);
        await checkoutInformationPage.clickButton('continue');
        await checkoutoverviewPage.assertPage();
        await checkoutoverviewPage.assertPrice();
        await checkoutoverviewPage.clickButton('finish');
        await chcekoutCompletePage.assertPage();
        await chcekoutCompletePage.clickButton();
    });
});

test('go to item page from main page, check item info, add and remove item from cart', async ({ page }) => {
    const mainPage = new MainPage(page);
    const itemPage = new ItemPage(page);
    const itemName = 'Sauce Labs Backpack'

    await mainPage.goToItem(itemName);
    await itemPage.assertPage();
    //add item to cart
    await itemPage.clickButton();
    await itemPage.assertItemsInCart(1, 'Remove');
    //remove item from cart
    await itemPage.clickButton();
    await itemPage.assertItemsInCart(0, 'Add to cart');
});
