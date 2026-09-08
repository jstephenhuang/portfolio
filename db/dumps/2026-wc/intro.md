# Introduction

A more complete context of this project can be found under the [README.md](https://github.com/jstephenhuang/2026-world-cup/blob/main/README.md) of this repo (all written in my words).

This project predicts each 2026 World Cup team's chance to advance from the group stage, reach each knockout round, and win the title. A calibrated random forest estimates each match from nine features, including Elo ratings, venue, tournament context, and recent form. I then ran 20,000 tournament simulations to turn match probabilities into tournament probabilities.

## Implementation

All I had before implementing this project, was I knew wanted to use Random Forest, how Random Forest generally worked, and I had a Kaggle set.

The goal was to use a Random Forest to help me predict the games for the world cup based on previous data which would help me build a bracket.

I asked Claude some questions on this goal: how would it look like, what am I missing, what are alternatives to using a Random Forest, if it was even possible.

I read the few first sentences saying yes and that Random Forests was actually a good method. So I typed "let's go".

And I will be honest, after Claude wrote a summary, I didn't even bother to read it. I went straight to reading the README.md I told it to generate for me and ran the Monte Carlo simulations. I just wanted to make my bracket...

There was a couple of questions I had for Claude for the results and what they meant and how it was aggregated.

But the source code that you see im the repo is pretty much from this one shotted prompt.

## Conclusion

After making my bracket based on this table, I decided to acutally spend time understanding what was happening.

I asked Claude more than a 1000 questions. In fact, the links and blobs of paragraphs that it gave me help me write this readme. My biggest confusion is how you train a Random Forest with data. More specifically how does the individual trees create the nodes, and how does it know how to stop creating nodes (stop asking yes-or-no questions).

Explained in the [README.md](https://github.com/jstephenhuang/2026-world-cup/blob/main/README.md), we first process the raw dataset and extract as many relevant features (elo, recent_goals, etc...).

Now how do we use the extracted feature to train our trees?

scikit-learn abstracts this away from us, but it essentially:

### 1. Considers many possible questions

At each node, the tree generates possible questions (nodes) using the extracted features, say we are starting a root node:

- Is `elo_diff <= -160`?
- Is `elo_diff <= -80`?
- Is `elo_diff <= 70`?
- Is `recent_goals <= 1.5`?

These candidate questions split the historical matches into two branches.

### 2. Scores the questions based on the split

How do score a question? By checking if the outcome from the division is mixed or not.

For example, take the question: `Is elo_diff <= 70?`.

Consider Germany (elo: 1000) vs France (elo: 1300) in 2014. Germany's elo difference would be:

```text
elo_diff = 1000 - 1300 = -300
```

For the question , this match would enter the `Yes` branch because `-300 <= 70`. Germany won, so the known outcome would be classified as a home win.

_Note that home / away is just used to classified which team won. So home win in the case above means Germany won, France lost._

Now consider Brazil (elo: 1200) vs Netherlands (elo: 1250) in 2014:

```text
elo_diff = 1200 - 1250 = -50
```

This match would also enter the `Yes` branch because `-50 <= 70`. However, the Netherlands won, so the known outcome would be classified as away win (Brazil lost, Netherlands won).

The branch now contains:

```text
yes:
Germany vs. France     -> home win
Brazil vs. Netherlands -> away win
```

This branch is impure because matches that satisfied the same question (both Yes) produced different outcomes.

There are different equations for measuring impurity. One of them is Gini impurity, which I still have yet to fully understand. But briefly,

The Gini impurity is:

$$
G = \sum_{k} p_{k}(1-p_{k})
$$

where $p_k$ is the proportion of matches belonging to outcome $k$. Source: https://scikit-learn.org/stable/modules/tree.html#tree-mathematical-formulation

Suppose a node contains:

- 5 home wins
- 3 draws
- 2 away wins

Substituting each outcome's proportion into the formula:

$$
G
= \left(\frac{5}{10}\right)\left(1-\frac{5}{10}\right)
+ \left(\frac{3}{10}\right)\left(1-\frac{3}{10}\right)
+ \left(\frac{2}{10}\right)\left(1-\frac{2}{10}\right)
= 0.62
$$

This formula can also be rewritten because the proportions of all outcomes add up to $1$:

$$
\begin{aligned}
G
&= \sum_k p_k(1-p_k) \\
&= \sum_k p_k - \sum_k p_k^2 \\
&= 1 - \sum_k p_k^2
\end{aligned}
$$

Using that equivalent form:

$$
G
= 1
- \left(\frac{5}{10}\right)^2
- \left(\frac{3}{10}\right)^2
- \left(\frac{2}{10}\right)^2
= 0.62
$$

You can see if we only had one outcome, the score will be 0 (pure). But if we had multiple or a mixed of outcomes, the proportions are not only small but the squared makes them even smaller resulting in a larger score (impure).

### 3. Recursively builds the tree

After each candidate has a score, we pick the question that resulted in the greates **reduction** impurity score.

What does reduction here mean? I also had a hard time understanding, but essentially, we take the current impurity score of the node (the parent impurity), and substract the impurity of their children nodes.

What are the base conditions?

Splitting stops when:

- A group contains only one outcome (all leaf nodes are the same outcome)
  - Deep decision trees often produce pure leaves, which is one reason an individual tree can overfit. A random forest reduces this problem by averaging predictions from many different trees.
- The configured maximum depth has been reached.
- The node does not contain enough matches to split, according to `min_samples_split`.
- A candidate split would create a branch with fewer matches than `min_samples_leaf`.
- No candidate question produces a sufficient reduction in impurity.
- The configured maximum number of leaf nodes has been reached.
