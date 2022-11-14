import { Box, Typography } from "@mui/material";
import React from "react";
import { FiChevronRight } from "react-icons/fi";
import NextLink from "./NextLink";
import { BreadcrumbProps } from "./types";

export interface BreadCrumbLineProps {
  items?: BreadcrumbProps;
  query?: {
    [x: string]: string
  }
}

const BreadCrumbLine = ({ items, query, ...rest }: BreadCrumbLineProps) => {
  return (
    <Box {...rest}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {items && items?.map((item, index) => (
          <React.Fragment key={item.url}>
            <NextLink
              href={{
                pathname: item.url,
                query: item?.query ?? {}
              }}
            >
              <Box
                sx={{
                  m: "$2",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: item?.textColor ? item?.textColor : "default",
                    fontStyle: "normal",
                    fontWeight: "400",
                    fontSize: "16px",
                    lineHeight: "19px",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            </NextLink>

            {index < items.length - 1 && (
              <Box
                sx={{
                  m: "$2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  top: "$1",
                }}
              >
                <FiChevronRight />
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default BreadCrumbLine;
