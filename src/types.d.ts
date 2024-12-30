declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "@decky/manifest" {
  const name: string;
  const author: string;
  const flags: string[];
  const api_version: number | undefined;
  const publish: {
    tags: string[];
    description: string;
    image: string;
  };
}
