from fastcore.utils import *
from ghapi import *
import tarfile

owner = 'renato145'
repo = 'gh_actions_explore'
bin_name = 'scrapper'

api = GhApi(owner=owner, repo=repo, token=github_token())

release = api.repos.get_latest_release()
tag = release.tag_name
print(f'Using tag: {tag!r}')

print('type', type(release.assets))
assets = [o for o in release.assets if getattr(o, 'name', '') == bin_name]
if len(assets) > 0:
    # Remove asset if exists
    rm_asset = assets[0]
    print(rm_asset)
    print('Removing previous asset...')
    api.repos.delete_release_asset(asset_id=rm_asset.id)

# Upload asset
fn = f'news_scrapper/scrapper'
print(f'Uploading {fn!r}...')
api = GhApi(owner='fastai', repo='hugo-mathjax', token=github_token())
rel = api.repos.get_release_by_tag(tag)
api.upload_file(release, fn)
