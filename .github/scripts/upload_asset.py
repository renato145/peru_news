from fastcore.utils import *
from ghapi import *
# import tarfile

owner = 'renato145'
repo = 'peru_news'
bin_name = 'scrapper'

api = GhApi(owner=owner, repo=repo, token=github_token())

release = api.repos.get_latest_release()
tag = release.tag_name
print(f'Using tag: {tag!r}')

assets = [o for o in release.assets if getattr(o, 'name', '') == bin_name]
if len(assets) > 0:
    print('Removing previous asset...')
    api.repos.delete_release_asset(asset_id=assets[0].id)

# Upload asset
fn = f'news_scrapper/scrapper'
print(f'Uploading {fn!r}...')
api.upload_file(release, fn)
