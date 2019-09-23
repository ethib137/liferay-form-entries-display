# Liferay Form Entries Display `7.2`

A simple react portlet for displaying form entries.

## Usage
Through system portlet configuration update the user auth if not already set for u:`test@liferay.com` p:`test`.

![systemConfiguration](/images/systemConfiguration.png)

Add the portlet to the page. You will find it under collaboration in the widget menu.

In the portlet instance configuration add the `formId` you want to display and choose whether or not you want draft form entries to show.

![instanceConfiguration](/images/instanceConfiguration.png)

Refresh the page and you should see your results displayed.

![formEntries](/images/formEntries.png)

## How to Build and Deploy to Liferay

Update the `liferayDir` to point to your Liferay home in `.npmbuildrc`.

### Build
` $ npm run build `

The jar file will be in `dist/liferay-form-entries-display-1.0.0.jar`.

### Deploy to Liferay
` $ npm run deploy `

## Issues & Questions Welcome