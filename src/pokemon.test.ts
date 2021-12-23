import { Browser, Page, webkit, devices } from "playwright";
import DataHelper from "./data-helper";
import DefaultMethods from "./default-methods";

let browser: Browser;
let page: Page;
let item: DefaultMethods;

beforeAll(async () => {
  browser = await webkit.launch({ headless: false });
  const context = await browser.newContext({ ...devices[DataHelper.IPHONE] });
  page = await context.newPage();
  await page.goto(DataHelper.HOME_PAGE);
  item = new DefaultMethods(page);
});

afterAll(async () => {
  await browser.close();
});

it("Verify that price is more than 50", async () => {
  await item.searchItem(DataHelper.SEARCH_ITEM);
  await item.openDetailPage();
  const price = await item.getPrice();
  expect(price).toBeGreaterThan(50);
});

it("Verify thumbnail images", async () => {
  const images = await item.getThumbnailImages();
  expect(images).toHaveLength(3);
});

it("Verify feedback starts", async () => {
  const stars = await item.getStars();
  expect(stars).toHaveLength(5);
});
