from fastcore.utils import *
from ghapi import *
# import tarfile

owner = 'renato145'
repo = 'gh_actions_explore'

release = GhApi().repos.get_latest_release(owner, repo=repo)
print(f'Using tag: {release.name!r}')
print(release)

# upload_url
# print(f'New release: {tag}')


# rel = GhApi().repos.get
# rel = GhApi().repos.get_release_by_tag(owner='gohugoio', repo='hugo', tag=tag)
# with urlopen(rel.tarball_url) as f: untar_dir(f, 'hugo')
# os.chdir('hugo')
# run(f'patch -l -p1 -i ../hugo.patch')
# run('go build --tags extended')
# ext_nm = 'hugo.exe' if platform=='win' else 'hugo'
# fn = f'hugo-{platform}.tgz'
# with tarfile.open(fn, "w:gz") as tar: tar.add(ext_nm)

# api = GhApi(owner='fastai', repo='hugo-mathjax', token=github_token())
# rel = api.repos.get_release_by_tag(tag)
# api.upload_file(rel, fn)
