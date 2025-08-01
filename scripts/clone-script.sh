rm -rf .gh-pages && \
git clone -b gh-pages https://github.com/ardina22/e-module.git .gh-pages && \
rm -rf public/modules && \
rm -rf public/images && \
cp -R .gh-pages/assets/images public && \
cp -R .gh-pages/modules public/modules && \
rm -rf .gh-pages