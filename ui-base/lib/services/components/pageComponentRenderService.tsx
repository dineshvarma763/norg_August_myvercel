import { detectAndRenderProductDetails } from "../ecommerce/ecommerceRenderService";
import { getLogger } from "../logging/LogConfig";

const log = getLogger("headless.services.components.pageComponentRenderService");

export function renderComponentContent(data:any) {

  let productRendering = detectAndRenderProductDetails(data);

  return (
    <>
    {productRendering}
    </>
  );
}