import { expect, test } from "@playwright/test";
const routes = ["/servicos", "/servicos/polimento-automotivo", "/servicos/higienizacao-interna", "/servicos/higienizacao-de-estofamentos", "/servicos/caminhoes", "/servicos/maquinas-agricolas", "/resultados", "/sobre", "/contato", "/privacidade"];
for (const width of [375, 390, 430, 768, 1024, 1280, 1440]) {
  test(`home sem overflow e com CTA em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".hero-actions a").first()).toHaveAttribute("href", /^https:\/\/wa\.me\/5551995888316\?text=/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    await expect(page.locator(".hero-art img")).toHaveJSProperty("complete", true);
    expect(await page.locator(".hero-art img").evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
}
for (const route of routes) {
  test(`rota ${route} carrega em celular`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await expect(page.locator("body")).not.toContainText("Application error");
  });
}
test("menu mobile abre, fecha por Escape e navega", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.getByRole("navigation", { name: "Navegação mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("navigation", { name: "Navegação mobile" }).getByRole("link", { name: "Serviços" }).click();
  await expect(page).toHaveURL(/\/servicos$/);
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
});
test("WhatsApp mantém telefone e mensagem de cada serviço", async ({ page }) => {
  await page.goto("/servicos/polimento-automotivo");
  const links = await page.locator('a[href^="https://wa.me/"]').evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));
  expect(links.length).toBeGreaterThan(0);
  for (const href of links) expect(new URL(href).pathname).toBe("/5551995888316");
  expect(links.some((href) => new URL(href).searchParams.get("text")?.toLowerCase().includes("polimento automotivo"))).toBe(true);
});
test("serviço inexistente retorna 404", async ({ page }) => {
  const response = await page.goto("/servicos/nao-existe");
  expect(response?.status()).toBe(404);
});
test("admin não expõe edição sem configuração", async ({ page }) => {
  test.skip(Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), "Ambiente conectado tem autenticação própria.");
  await page.goto("/admin");
  await expect(page.locator("body")).toContainText(/Supabase|configuração/i);
  await expect(page.getByRole("button", { name: /Salvar alterações/i })).toHaveCount(0);
});