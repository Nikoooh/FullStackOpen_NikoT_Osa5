const { test, describe, expect, beforeEach } = require('@playwright/test');
import { users } from '../helpers/helpers';

describe('blogs', async () => {

  beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset');

    await request.post('http://localhost:3003/api/users', {
      data: users[0]
    })

    await page.goto('http://localhost:5173/')

  })

  test('login form', async ({ page }) => {
    await expect(page.getByText('Log in')).toBeVisible()
  });

  test('only creator sees delete button', async ({ page, request }) => {
    await request.post('http://localhost:3003/api/users', {
      data: users[1]
    })

    await page.getByTestId('username').fill('playtester')
    await page.getByTestId('password').fill('password')
    await page.getByRole('button', {name: 'Login'}).click()

    // new blog
    await page.getByRole('button', {name: "New blog"}).click()   
    await page.getByRole('textbox', {name: "title"}).fill('new blog test')
    await page.getByRole('textbox', {name: "author"}).fill('playwright tester')
    await page.getByRole('textbox', {name: "url"}).fill('https://test.com')
    await page.getByRole('button', {name: "Create blog"}).click()

    // logout, login on second user

    await page.getByRole('button', {name: "Log out"}).click() 
    await page.getByTestId('username').fill('deletetester')
    await page.getByTestId('password').fill('123')
    await page.getByRole('button', {name: 'Login'}).click()

    // check del

    await page.getByRole('button', {name: "view"}).last().click()
    await expect(page.getByRole('button', {name: "Delete blog"})).not.toBeVisible()

  })

  test('most liked blog, is at the top', async ({ page }) => {
    await page.getByTestId('username').fill('playtester')
    await page.getByTestId('password').fill('password')
    await page.getByRole('button', {name: 'Login'}).click()

    // blog 1

    await page.getByRole('button', {name: "New blog"}).click()   
    await page.getByRole('textbox', {name: "title"}).fill('no likes blog')
    await page.getByRole('textbox', {name: "author"}).fill('likeless')
    await page.getByRole('textbox', {name: "url"}).fill('https://test.com')
    await page.getByRole('button', {name: "Create blog"}).click()

    // blog 2

    await page.getByRole('button', {name: "New blog"}).click()   
    await page.getByRole('textbox', {name: "title"}).fill('1 like blog')
    await page.getByRole('textbox', {name: "author"}).fill('liked')
    await page.getByRole('textbox', {name: "url"}).fill('https://test.com')
    await page.getByRole('button', {name: "Create blog"}).click()

    await page.getByText("1 like blog").waitFor({state: 'visible'})

    // like the latest blog, last on the list

    await page.getByRole('button', {name: "view"}).last().click()
    await page.getByRole('button', {name: "like"}).click()

    await page.getByText("likes: 1").waitFor({state: 'visible'})

    await page.getByRole('button', {name: "hide"}).click()

    // check if first blog on the list has the most likes (1)

    await page.getByRole('button', {name: "view"}).first().click()
    await expect(page.getByText('likes: 1')).toBeVisible()
    
  })

  describe('login', async () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('playtester')
      await page.getByTestId('password').fill('password')

      await page.getByRole('button', {name: 'Login'}).click()

      await expect(page.getByText('Niko logged in')).toBeVisible()
    })

    test('fails with incorrect credentials', async ({ page }) => {
      await page.getByTestId('username').fill('playtest')
      await page.getByTestId('password').fill('passwor')

      await page.getByRole('button', {name: 'Login'}).click()

      await expect(page.getByText('password or username incorrect')).toBeVisible()
    })
  })

  describe('when logged in', async () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('playtester')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', {name: 'Login'}).click()

      await page.getByRole('button', {name: "New blog"}).click()
      
      await page.getByRole('textbox', {name: "title"}).fill('new blog test')
      await page.getByRole('textbox', {name: "author"}).fill('playwright tester')
      await page.getByRole('textbox', {name: "url"}).fill('https://test.com')

      await page.getByRole('button', {name: "Create blog"}).click()
    })

    test('new blog can be made', async ({ page }) => {

      await expect(page.getByText('a new blog created')).toBeVisible()

    })

    test('blogs can be liked', async ({ page }) => {

      await page.getByRole('button', {name: "view"}).last().click()
      await page.getByRole('button', {name: "like"}).click()
      
      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    test('made blog can be deleted', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept())

      await page.getByRole('button', {name: "view"}).last().click()
      await page.getByRole('button', {name: "Delete blog"}).click()

      await expect(page.getByText('new blog test')).not.toBeVisible()
    })

  })
  
})



