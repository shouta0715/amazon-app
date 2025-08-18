import type { Metadata } from "next";
import type { FC, ReactNode } from "react";

declare module "next" {
  export type NextSegmentPage<
    Params extends string = never,
    SearchParams extends string = never,
  > = FC<{
    params: Promise<Record<Params, string>>;
    searchParams: Promise<Partial<Record<SearchParams, string | string[]>>>;
  }>;

  // https://nextjs.org/docs/app/api-reference/file-conventions/layout#layouts-do-not-receive-searchparams
  export type NextSegmentLayout<Params extends string = never> = FC<{
    children: ReactNode;
    params: Promise<Record<Params, string>>;
  }>;

  export type GenerateMetadata<Params extends string = never> = (args: {
    params: Promise<Record<Params, string>>;
  }) => Promise<Metadata>;

  export type NextSegmentProps<
    Params extends string = never,
    SearchParams extends string = never,
  > = {
    params: Promise<Record<Params, string>>;
    searchParams: Promise<Partial<Record<SearchParams, string | string[]>>>;
  };
}
