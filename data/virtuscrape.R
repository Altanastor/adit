library(rvest)
library(tidyverse)

vl <- read_html("http://www.virtuleap.com")
links <- html_nodes(vl, 'a[href*="apps/details"]')
apps <- lapply(links, function(x) {
  a <- read_html(html_attr(x, "href"))
  html_nodes(a, ".stat-box strong") %>%
    sapply(html_text) %>%
    as.numeric() %>%
    setNames(c("votes", "plays")) %>%
    as.list() ->
    app
  html_node(a, ".specific-app-content h1") %>%
    html_text() %>%
    setNames("title") %>%
    c(app) ->
    app
  get_detail <- function(x, name) {
    tmp <- x %>%
      html_nodes(".specific-app-detail-box") %>%
      Filter(f = function(x) { 
        html_text(html_children(x)[[1]]) == name 
      })
    if(length(tmp)) {
      val <- tmp %>%
        `[[`(1) %>%
        html_children() %>%
        `[[`(2) %>%
        html_text() %>%
        setNames(gsub("[[:space:]]", "", tolower(name)))
    } else {
      val <- character(0)
    }
    val 
  }
  app <- c(app, get_detail(a, "Country"))
  dev <- get_detail(a, "Developer name")
  if(!length(dev)) dev <- get_detail(a, "Team name")
  if(!length(dev)) dev <- get_detail(a, "Company name")
  app <- c(app, dev)
    
})

appsdf <- do.call(bind_rows, apps)
appsdf <- appsdf %>%
  mutate(name = na.omit(c(companyname, developername, teamname))) %>%
  select(-developername, -companyname, -teamname)
#write.csv(select(appsdf, title), "ranks.csv", row.names = FALSE)
appsdf <- left_join(appsdf, read_csv("data/ranks.csv"), by = "title")

library(countrycode)
appsdf <- appsdf %>%
  mutate(region = countrycode(country, "country.name", "region"))
write_csv(appsdf, "data/contest.csv")
