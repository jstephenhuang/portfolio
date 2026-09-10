# Brief Prelude

Everything below is written in my own words and represents my current understanding of **random forests**. Some of it could be wrong, as my machine learning knowledge is still pretty limited and I have not spent too much time studying the fundamental concepts. Also, expect plenty of grammar and syntax mistakes :)

_I did use ChatGPT to employ better words and suggest more coherent ways to write my sentences._

# Context

Back when March Madness was happening, I participated in my class's NCAA basketball tournament bracket. I do play basketball, but I have zero knowledge of collegiate basketball teams and players. I did not want to create my bracket based on feeling, with zero strategy. Therefore, I did a little research on some ways I could use machine learning to help me create my picks. I stumbled upon random forests. They seemed simple and intuitive, and so I dove a little deeper into them, understanding the foundations of random forests. Furthermore, there were multiple Kaggle datasets containing relevant data from previous NCAA tournaments. Unfortunately, I did not have time to implement a working random forest to help with the bracket. I ended up making my picks from pure feeling and instinct. I placed low on the leaderboard.

That was March 2026.

With the 2026 FIFA World Cup this summer, I had another chance at implementing my random forest. Coding agents have gotten so good that I could even ask them to refine and strengthen my predictions.

This [repository](https://github.com/jstephenhuang/2026-world-cup/blob/main/README.md) attempts to predict how likely each country in the 2026 World Cup is to advance, reach the R16, reach the quarter-finals, reach the semi-finals, reach the final, and win the title.

# Execution

Before implementing this project, all I knew was that I wanted to use a random forest, I had a general idea of how random forests worked, and I had a Kaggle dataset. My goal was to use previous match data to predict the games in the World Cup and help me build my bracket.

I asked Claude a few questions about this goal: what the project would look like, what I was missing, what would be added, what alternatives there were to random forests, whether a random forest was a good model for predicting the World Cup, and whether it was even possible. I will be honest: I skimmed through the responses and saw that it was possible and that random forests were actually a good method, so I typed, "build it."

After Claude wrote a summary indicating that it had finished, I did not even bother to read it. I went straight to the README.md I had asked it to generate and followed the instructions. There, I learned that I had to run Monte Carlo simulations (a step that I didn't even instruct it to do because I simply didn't know what it was). I just wanted to make my bracket...

After understanding what a Monte Carlo simulation was and its purpose, I ran 20,000 of them and got a final [csv](https://github.com/jstephenhuang/2026-world-cup/blob/main/predictions_2026.csv) with each country and its probabilities of reaching each stage of the World Cup. I made my bracket based on that csv and submitted my bracket.

If you notice that there is only one commit that has the diffs for the source code, it's because it really came entirely from that one prompt (with some follow-up debugging prompts).

# Random Forests

After making my bracket based on this table, I decided to actually spend time understanding what was happening. I could not claim that I knew how to use random forests when I had zero idea of how they worked...

I mentioned that I did some research on random forests. That consisted of watching a couple of videos on YouTube and briefly reading a few papers about random forest classifiers. From that quick research, I described a random forest in one sentence: a random forest aggregates the predictions of x decision trees, each trained a little differently, to estimate the probability of each possible outcome.

That is the general idea, but I still had no idea how each individual decision tree was trained.

After submitting my bracket, I asked GPT and Claude over 1,000 questions about random forests to really understand the math and the intuitive idea of this machine learning model.

## What is a random forest?

To understand a random forest, it is important to understand its fundamental component: a decision tree. A decision tree starts with a root node (a root question). Given the inputs, each answer takes the tree farther down until it reaches a leaf node (a possible output).

A **decision tree** is a tree-like structure that predicts an outcome by asking a sequence of yes-or-no questions at its nodes.

![alt text](/2026-wc/excalidraw-dt.png)

When you group many of these trees together, they form a **forest**. Each tree is trained using a **random** sample of the dataset, making the trees slightly different from one another, much like in a real forest. Put the two ideas together, and you get a **random forest**.

Okay... but this still leaves some important questions about the decision tree itself:

- How does the decision tree know how to ask the right question?
- How does the decision tree know when to stop?
- How does the decision tree use the historical data?
- What is a good vs a bad decision tree?
- When would we choose a random forest over a decision tree?

## Quick digression

One thing I did not realize at the start was that a decision tree is a classification model. This seems obvious once you stop and think about it, but it genuinely had not occurred to me. In other words, decision trees have the same goal as other classification models, such as logistic regression, but they learn how to separate the classes in a different way. (Classifying data, I learned, is a common task in machine learning.)

Suppose we have a binary classification problem where we are given a fruit that is either an apple or a banana, and we are tasked with determining whether it is an apple or a banana.

We first need to define the key features of a fruit (three for simplicity), such as roundness, color, and sweetness.

A **logistic regression** model would have a weight vector $\mathbf{w}$ with three entries, one weight for each feature. Given a fruit, we extract its features into a vector $\mathbf{x}$ and calculate:

$$
z = \mathbf{w}^{T}\mathbf{x} + b
$$

We then pass the result through the sigmoid function:

$$
p = \frac{1}{1 + e^{-z}}
$$

This converts the result into a value between $0$ and $1$. If we define $0$ as apple and $1$ as banana, a value greater than or equal to $0.5$ would predict banana, while a value below $0.5$ would predict apple.

I do not fully understand how the weights are trained yet, but from what I understand, it is somewhat similar to how a neural network corrects its weights. Logistic regression has a loss function, and we use gradient descent to adjust the weights using $\alpha$ as the learning rate (maybe a topic for later).

A **decision tree** would instead separate the fruits by asking a sequence of yes-or-no questions:

- Is the fruit round?
- Is the fruit red?
- Is the fruit longer than 15 centimetres?

Each answer sends the fruit down a different branch until it reaches either apple or banana.

Both models are trying to learn how to separate apples from bananas using known examples. The difference is how they create that separation. A linear model learns a weighted boundary, while a decision tree learns a sequence of questions.

BUT HOW DOES THE TREE LEARN WHAT A GOOD SEQUENCE OF QUESTIONS IS? Get to the point already, Stephen! (This was not a quick digression.)

## How do we train a decision tree?

Okay, let me get back on track. How do we train a decision tree using supervised learning on the historical data ([Kaggle dataset](https://www.kaggle.com/datasets/martj42/international-football-results-from-1872-to-2017/data))?

### Feature engineering

First, we need to define the inputs and outputs of the decision tree, because it depends heavily on the relationship between the input features and the known outputs in the training data.

- The inputs determine which questions the tree can ask.
- The outputs determine whether that question is useful.

Thinking back to the original goal, using information available before the match (input), I want the model to classify its outcome as one of three possibilities: home win, draw, or away win (output).

But the inputs require a little more work because they depend on the data. As I mentioned in my **Quick digression**, we first need to extract useful features from the given dataset.

Raw data is not always stored in a form that a model can use directly. We need to process it into values that describe the match and allow the tree to ask yes-or-no questions. I will refer to this process as **extracting features**, although **feature engineering** is probably the more accurate term. Thus, we need features that describe the strength and recent performance of both teams before the match begins.

I did not choose these features myself. I asked Claude to examine the [Kaggle dataset](https://www.kaggle.com/datasets/martj42/international-football-results-from-1872-to-2017/data) and determine which features could be useful. It suggested nine:

1. `elo_diff`: the home team’s Elo rating minus the away team’s Elo rating
2. `home_elo`: the home team’s Elo rating before the match
3. `away_elo`: the away team’s Elo rating before the match
4. `neutral`: `1` if the match was played at a neutral venue, otherwise `0`
5. `is_tournament`: `1` if the match was not a friendly, otherwise `0`
6. `home_form_gf`: the home team’s average goals scored over its previous five matches
7. `home_form_ga`: the home team’s average goals conceded over its previous five matches
8. `away_form_gf`: the away team’s average goals scored over its previous five matches
9. `away_form_ga`: the away team’s average goals conceded over its previous five matches

Claude did not directly extract every value itself. It selected the features and generated the logic used to calculate them from the historical data.

I won't go into too much detail about how Claude calculated these features; they are pretty intuitive and simple. The most interesting one is the Elo rating of a country. Using the [Elo Rating algorithm](https://www.geeksforgeeks.org/dsa/elo-rating-algorithm), we can replay the historical matches in chronological order and extract an Elo rating for a country.

Once the features have been calculated, each historical match can be represented as:

- inputs: the nine features before the match
- output: home win, draw, or away win

One important limitation is that during each simulated World Cup, the model keeps every team’s Elo rating and recent form fixed. The ratings and form values do not change after simulated matches. Updating them throughout the tournament is one possible improvement I could make in the future.

### Considers many possible questions

Now that each historical match has been turned into a set of features, the tree can start learning. At the root node, it begins with every match in the training data and considers many possible questions.

For example, it could ask:

1. Is `elo_diff` less than or equal to $-160$?
2. Is `elo_diff` less than or equal to $-80$?
3. Is `elo_diff` less than or equal to $70$?
4. Is `home_form_gf` less than or equal to $1.5$?

Each question splits the historical matches into two branches:

1. `Yes`: matches that satisfy the question
2. `No`: matches that do not

How do the tree know which question to pick?

### Scores the questions based on the split

A question is useful if it creates branches with outcomes that are less mixed. More specifically, it is the branches that are pure or impure, not the question itself.

For example, consider this question: **Is `elo_diff` less than or equal to 70?**

Suppose the match Germany vs France (2014) where Germany has an elo of 1000 and France has an elo of 1300:

$$
\texttt{elo\_diff} = 1000 - 1300 = -300
$$

Since $-300 \le 70$, this match enters the `Yes` branch. In 2014, Germany won 0-1, so its known outcome is a home win.

Here, **home win** only means that the team recorded as the home team won. It does not necessarily mean the match was played in that team’s country.

_In our case, we consider the home team as the one listed first, the country on the left of the **vs**._

Now consider Brazil (home team) against the Netherlands (away team) also in 2014:

$$
\texttt{elo\_diff} = 1200 - 1250 = -50
$$

This match also enters the `Yes` branch because $-50 \le 70$. However, the Netherlands won, so this match is labelled as an away win.

The `Yes` branch now contains:

- Germany vs France: home win
- Brazil vs Netherlands: away win

This branch is impure because two matches that answered the same question produced different outcomes. A pure branch would contain only home wins, only draws, or only away wins.

Of course, we cannot judge the entire question using only its `Yes` branch. We also need to look at the `No` branch and see how mixed its outcomes are.

What is a mathematical way to see how pure a branch is?

### Measuring impurity with Gini impurity

There are different ways to measure how mixed a node is. One of them is **Gini impurity**, which is used by default in scikit-learn’s decision tree classifiers.

$$
G = \sum_k p_k(1-p_k)
$$

Here, $p_k$ is the proportion of matches in the node that belong to outcome $k$. You can find the formal definition in the [scikit-learn documentation](https://scikit-learn.org/stable/modules/tree.html#tree-mathematical-formulation).

Suppose a node contains:

- 5 home wins
- 3 draws
- 2 away wins

The Gini impurity is:

$$
\begin{aligned}
G
&=
\left(\frac{5}{10}\right)
\left(1 - \frac{5}{10}\right)
+
\left(\frac{3}{10}\right)
\left(1 - \frac{3}{10}\right)
+
\left(\frac{2}{10}\right)
\left(1 - \frac{2}{10}\right) \\
&= 0.62
\end{aligned}
$$

The formula can also be written as:

$$
\begin{aligned}
G
&= \sum_k p_k(1-p_k) \\
&= \sum_k p_k - \sum_k p_k^2 \\
&= 1 - \sum_k p_k^2
\end{aligned}
$$

Intuitively this makes sense:

- If every match in a node has the same outcome, there is only one outcome whose proportion is $1$. Thus, the Gini impurity is $0$, which means the node is completely pure.

- If the outcomes are mixed, no single proportion is $1$. Furthermore, as the outcomes become more evenly mixed, the proportions get minimized, and so the sum of the **squared** proportions becomes smaller. So the Gini impurity becomes larger.

I still have not gone deeply into the mathematics behind Gini impurity, but the goal makes sense. We want the tree to group similar historical outcomes together so that it has a better chance of classifying a new match that reaches the same group.

### Chooses the best question and recursively builds the tree

For every candidate question, the tree calculates the weighted impurity of both branches:

$$
G_{\text{split}}
=
\frac{n_{\text{yes}}}{n}G_{\text{yes}}
+
\frac{n_{\text{no}}}{n}G_{\text{no}}
$$

where $n$ is the total number of matches in the node before the split, $n_{\text{yes}}$ is the number of matches sent to the `Yes` branch, and $n_{\text{no}}$ is the number sent to the `No` branch.

The weighting matters because a question should not look amazing just because it creates one tiny pure branch, the other branch might be insanely mixed.

The tree then calculates the reduction in impurity:

$$
\text{reduction}
=
G_{\text{current node}}
-
G_{\text{split}}
$$

It chooses the question with the greatest reduction in impurity. This is the question that separates the historical outcomes most cleanly at the current node.

For example, for the root node, we first calculate the impurity of all historical matches which would the impurity of the root. Then, for each candidate question, we split the matches into its `Yes` and `No` branches, calculate the impurity of each branch, and sum them into the weighted impurity, $G_{\text{split}}$. We subtract this value from the impurity of the root and repeat the process for every candidate question. The question with the largest reduction is chosen.

Intuitively, this makes sense. If the current node is very mixed, its impurity score is large. A good question should separate those matches into branches that are less mixed, giving us a smaller $G_{\text{split}}$. The smaller $G_{\text{split}}$ is, the larger the reduction in impurity becomes.

After choosing the best question for the root node, the tree repeats the exact same process separately for the `Yes` and `No` branches only using the matches that got split in that branch / in the current node (not all matches again). It keeps finding the best question available at each node until it reaches a stopping condition.

The tree is greedy. It chooses the best question at the current node, but it does not test every possible complete tree before deciding.

### When does the tree stop?

The tree stops splitting a node when one of these conditions is met:

1. Every match that reaches the node has the same outcome.
2. The configured maximum depth, `max_depth`, has been reached.
3. The node does not contain enough matches to split, according to `min_samples_split`.
4. A candidate question would create a branch with fewer matches than `min_samples_leaf`.
5. No candidate question produces a sufficient reduction in impurity above `min_impurity_decrease`.
6. The configured maximum number of leaf nodes has been reached.

Without these limits, a decision tree can become very deep and memorize the historical matches. It may then look extremely accurate on its training data but perform poorly on future matches. This is called overfitting.

A random forest helps reduce this problem by averaging predictions from many different trees, rather than relying on one tree that may have learned the historical data a little too well.

### scikit-learn

**scikit-learn** abstracts the entire process through `DecisionTreeClassifier` and `RandomForestClassifier`. Once we provide the features and known outcomes, calling `fit()` makes **scikit-learn** generate the candidate questions, calculate their impurity, choose the best splits, build the trees, and apply the stopping rules for us. Understanding what happens behind `fit()` is useful, but the library handles the actual implementation.

I have yet to (but I will) dive into the actual scikit-learn source code to see how all of this is implemented. My explanation is based entirely on the scikit-learn documentation and explanations from GPT. (I will upload another journal entry sharing my discoveries.)

## Not all trees are born the same in a random forest

Great, we now know how to train a tree. But one tree is prone to overfitting and will be too bloated as it tries to include all features, resulting in inaccurate predictions.

Therefore, rather than trusting just one tree, the random forest builds `x` slightly different decision trees.
Each tree is trained on a random sample of the historical matches and considers a random subset of features at each node.
Therefore, some trees might put more importance on certain features than other trees.
For example, Tree 1 might strictly have nodes comparing the countries' Elo ratings, but Tree 2 might instead look at their average goals.
Furthermore, some trees might have slightly different input feature values from other trees.
For example, Tree 1 might have an Elo rating of 2111 for Spain, but Tree 2 might have an Elo rating of 2001.

This is all done for us and abstracted away from us by the `RandomForestClassifier` class from scikit-learn.

Before predicting a match, the forest receives the same nine features extracted from the match.
In a Spain vs. Brazil match, Tree 1 might predict a Spain win, while Tree 2 might predict a draw, and maybe Tree 2 would predict Brazil to win.
The random forest aggregates all of our `x` trees' predictions.

As a result, we are left with a chart like this:

![alt text](/2026-wc/rf-chart-result.png)

We can convert these results to probabilities by dividing each count by the number of trees:

```json
{ "home win": 0.70333333333, "draw": 0.13, "away win": 0.16666666666 }
```

Look at that! Our random forest is able to predict the outcome of a match.

Lastly, the repo adds a calibration step that compares the results against the data one more time to see if the probabilities make sense. This is done by `CalibratedClassifierCV` from scikit-learn. But this is the basic idea: the forest combines many slightly different opinions into probabilities for a match outcome.

# Monte Carlo Simulation

Now that we can predict a match, we can simulate an entire World Cup.

For the Group Stage, we predict the 3 matches that each team plays and pick the top two teams of each group and the 8 best third-place finishers. For the Knockout Stage, we predict the 16 matches in the Round of 32, the 8 matches in the Round of 16, the 4 matches in the quarter-finals, the 2 matches in the semi-finals, and finally the final.

From one simulation, we might predict Argentina to have won the final, but based on the outcome of the 2026 World Cup, that was not the case.
Therefore, we simulate the World Cup more than once. In my case, I simulated 20,000 World Cups. We track, for each country, whether they advance, reach the Round of 16, the quarter-finals, the semi-finals, the final, or win the title.
In the end, I was left with [predictions_2026.csv](https://github.com/jstephenhuang/2026-world-cup/blob/main/predictions_2026.csv).

I discuss about the results in the [repo](https://github.com/jstephenhuang/2026-world-cup/blob/main/README.md)!

# Conclusion

This was a really fun project. I had over the top fulfillement seeing how I was able to forecast accurately the world cup games even though I had no knowledge of soccer. Not sure if this was fluke, it surely felt like a fluke since I didn't spend a lot time implementing it nor understand it at the time I created my bracket. This is something I definitely want to spend more time improving and prediction even more accurate outcomes.

It also proved to me that it is possible to learn hard concepts on your own as long as you don't give up and stay curious. I never took a class in machine learning and even though it took a lot of time, I eventually understood it by staying curious and asking a lot of questions.

I definitely want to revisit this in the future, such as by trying to predict March Madness next, but with an improved strategy and more time invested.
