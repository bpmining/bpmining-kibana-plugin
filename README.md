# bpmining Kibana Plugin <!-- omit in toc -->

Kibana Plugin to analyse your business processes.

- [✨Features](#features)
- [🚀Getting Started](#getting-started)
  - [🏗 Install the Kibana Plugin](#-install-the-kibana-plugin)
  - [🔨 Development](#-development)
    - [🤖 Setup](#-setup)
    - [📝 Scripts](#-scripts)

## ✨Features

## 🚀Getting Started

tbd

### 🏗 Install the Kibana Plugin

tbd

### 🔨 Development

#### 🤖 Setup

Before start developing you must setup your [Kibana development environment](https://github.com/elastic/kibana/blob/8.2/CONTRIBUTING.md#development-environment-setup).  
Clone the [Kibana repository](https://github.com/elastic/kibana/) and work through [this getting started guide](https://www.elastic.co/guide/en/kibana/master/development-getting-started.html)
If you can successfully run yarn kbn bootstrap then you are ready and can continue 🎉.

To develop the plugin locally you must mount it into the `/plugin` directory of the kibana repository. You can do so by **cloning** it into the directory **or** mounting it as **subtree**.

Adding the plugin as [git subtrees](https://www.atlassian.com/git/tutorials/git-subtree)) could be done by:

```bash
ä Adding the remote
git remote add bpmining git@github.com:bpmining/bpmining-kibana-plugin.git

# Adding the repo as subtree ar /plugins/bpmining
git subtree add --prefix plugins/bpmining --squash bpmining <branch>

# To push back
git subtree push --prefix plugins/bpmining bpmining <branch>
```

#### 📝 Scripts

<dl>
  <dt><code>yarn kbn bootstrap</code></dt>
  <dd>Execute this to install node_modules and setup the dependencies in your plugin and in Kibana</dd>

  <dt><code>yarn run build</code></dt>
  <dd>Execute this to create a distributable version of this plugin that can be installed in Kibana</dd>
</dl>
