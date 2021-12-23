import { ElementHandle, Page } from "playwright";
import DataHelper from "./data-helper";

const inputSelector = ".header-search input";

export default class DefaultMethods {
  constructor(private readonly page: Page) {
    // empty
  }

  public async searchItem(value: string): Promise<void> {
    await this.page.fill(inputSelector, value);
    await this.page.press(inputSelector, "Enter");
  }

  public async openDetailPage(): Promise<void> {
    const url = this.page.url();
    await this.page.goto(url + "&page=3");
    await this.page.click(`a[title]:has-text("${DataHelper.EXPECTED_ITEM_TITLE}")`);
    await this.page.waitForSelector("p.product-prices__big_color_red");
  }

  public async getPrice(): Promise<number> {
    const data = await this.page.$eval(
      "p.product-prices__big_color_red",
      (node) => (node as HTMLElement).innerText
    );
    const number = data.match(/\d+/)[0];
    return +number;
  }

  public async getThumbnailImages(): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
    const selector = "img.thumbnail__picture";
    await this.page.waitForSelector(selector);
    return this.page.$$(selector);
  }

  public async getStars(): Promise<ElementHandle<SVGElement | HTMLElement>[]> {
    await this.page.click(
      `.breadcrumbs__link span:has-text("${DataHelper.BREADCRUMBS_TITLE}")`
    );
    await this.page.click(
      `a.goods-tile__reviews-link:has-text("${DataHelper.FEEDBACK}")`
    );
    await this.page.waitForSelector(".form-wrapper .add-comment");
    await this.page.click("rating > span:nth-child(5) > svg");
    return this.page.$$('[gradientUnits="userSpaceOnUse"] [offset="100"]');
  }
}
