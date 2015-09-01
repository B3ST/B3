<!DOCTYPE html>
<!--[if lt IE 7]>
<html class="no-js lt-ie9 lt-ie8 lt-ie7 ui-mobile-rendering" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 7]>
<html class="no-js lt-ie9 lt-ie8 ui-mobile-rendering" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 8]>
<html class="no-js lt-ie9 ui-mobile-rendering" <?php language_attributes(); ?>> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js ui-mobile-rendering" <?php language_attributes(); ?>> <!--<![endif]-->
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php wp_title( '|', true, 'right' ); ?></title>
    <link rel="profile" href="http://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> role="document">
    <div id="header" class="site-header" role="header"></div>
    <div id="content-wrapper" class="site-body">
        <div id="main" class="site-body__main" role="main"></div>
        <div id="sidebar" class="site-body__sidebar"></div>
    </div>
    <div id="footer" class="site-footer" role="footer"></div>
    <div id="notifications" class="site-notifications"></div>
    <?php wp_footer(); ?>
</body>
</html>
