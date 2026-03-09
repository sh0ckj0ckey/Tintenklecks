<p align="center">
    <img src="./resources/brand.png" alt="logo" height="150" width="350"/>
</p>

<h3 align="center">Tintenklecks Gallery</h3>

<p align="center">Some components and helpers inside an Electron application with Vue 3 and TypeScript.</p>

## Overview

#### Basic Input

- [TkButton](#tkbutton)
- [TkHyperlinkButton](#tkhyperlinkbutton)
- [TkToggleButton](#tktogglebutton)
- [TkCheckBox](#tkcheckbox)
- [TkRadioButton](#tkradiobutton)
- [TkToggleSwitch](#tktoggleswitch)

#### Dialogs and Popups

- [TkPopup](#tkpopup)

#### Layout

- [TkSeparator](#tkseparator)

#### Status and Info

- [TkToast](#tktoast)

#### Motion

- [TkMarquee](#tkmarquee)

## Components

<a id="tkbutton"></a>
### <img src="./resources/icon-button-light.svg#gh-light-mode-only" width="24" height="16" /><img src="./resources/icon-button-dark.svg#gh-dark-mode-only" width="24" height="16" /> TkButton

TkButton is a basic button component for common user actions.

It provides five visual themes: `primary`, `secondary`, `success`, `warning`, and `danger`.
An optional subtle deboss effect can be enabled via props, intended to give the content a lightly pressed feel, like text written into paper.

#### Usage

``` vue
<TkButton theme="primary" deboss>
  Primary
</TkButton>
```
