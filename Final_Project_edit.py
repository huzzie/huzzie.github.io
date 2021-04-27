import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn import linear_model
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC, LinearSVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn import metrics
from sklearn.metrics import precision_recall_curve, roc_auc_score, roc_curve, confusion_matrix, classification_report
from statsmodels.stats.outliers_influence import variance_inflation_factor
from sklearn.model_selection import RandomizedSearchCV
from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestClassifier

os.chdir('/Users/hyunjaecho/Documents/GWU/Spring2021/visuals/Final_Project/data')

df_raw = pd.read_csv('BankChurners.csv')


# =============================D================================================
# Data Cleaning
# =============================================================================

# Remove unnecessary columns
df = df_raw.copy()
df = df.iloc[:, :-2]
df = df.iloc[:, 1:] # remove client number

from sklearn.preprocessing import LabelEncoder

# convert str into categorical 
lbe = LabelEncoder()
cat_cols = [x for x in df.columns if df[x].dtype == 'object']

for c in cat_cols:
    df.loc[:, c] = lbe.fit_transform(df.loc[:, c])

# Since it is unbalanced dataset, created dummay variable 
# SMOTE are used to balance the dataset 
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split

# dataset without target
df2 = df.drop('Attrition_Flag', axis = 1)
# split the dataset
X_train, X_test, Y_train, Y_test = train_test_split(df2, df.Attrition_Flag)

smote = SMOTE(random_state = 0)
X_train_smote, Y_train_smote = smote.fit_resample(X_train, Y_train)

#print(X_train.shape, y_train.shape)
print(X_train_smote.shape, Y_train_smote.shape)


# =============================================================================
# Feature Importance Function
# =============================================================================


def feature_importance(name_model):
    model = name_model
    model.fit(X_train_smote,Y_train_smote)
    importance = model.feature_importances_
    
    feats = {} # a dict to hold feature_name: feature_importance
    for feature, importance in zip(X_train_smote.columns, importance):
        feats[feature] = importance #add the name/value pair 
    
    importances = pd.DataFrame.from_dict(feats, orient='index').rename(columns={0: 'Gini-importance'})
    importances.sort_values(by='Gini-importance').plot(kind='bar', rot=45)
    return importances


# =============================================================================
# KNN
# =============================================================================
        
        
knn = KNeighborsClassifier(n_neighbors=7)
knn_fit = knn.fit(X_train_smote, Y_train_smote)
y_pred_knn = knn.predict(X_test)
y_pred_knn_train = knn.predict(X_train_smote)
knn_cv = cross_val_score(knn_fit, df2, df.Attrition_Flag, cv = 100, scoring = 'accuracy')

#KNN feature importance
importance = permutation_importance(knn, X_train, Y_train, scoring = 'accuracy')
importance = importance.importances_mean
print(importance)

print(confusion_matrix(Y_test, y_pred_knn))
# [[ 335   84]
#  [ 317 1796]]

print(classification_report(Y_test, y_pred_knn))
#               precision    recall  f1-score   support

#            0       0.51      0.80      0.63       419
#            1       0.96      0.85      0.90      2113

#     accuracy                           0.84      2532
#    macro avg       0.73      0.82      0.76      2532
# weighted avg       0.88      0.84      0.85      2532


# =============================================================================
# Decision Tree
# =============================================================================
# 
## Decision Tree
dc_model = DecisionTreeClassifier()
dc_fit = dc_model.fit(X_train_smote,Y_train_smote)
y_pred_dc = dc_model.predict(X_test)
y_pred_dc_train = dc_model.predict(X_train_smote)
dc_cv = cross_val_score(dc_fit, df2, df.Attrition_Flag, cv = 10, scoring = 'accuracy')

# Decision Tree feature_importance
print(feature_importance(dc_model))

print(confusion_matrix(Y_test, y_pred_dc))
# [[ 352   67]
#  [ 122 1991]]

print(classification_report(Y_test, y_pred_dc))

#               precision    recall  f1-score   support

#            0       0.74      0.84      0.79       419
#            1       0.97      0.94      0.95      2113

#     accuracy                           0.93      2532
#    macro avg       0.86      0.89      0.87      2532
# weighted avg       0.93      0.93      0.93      2532

# Cross evalution mean 
print(dc_cv)
#[0.85093781 0.86870681 0.89338598 0.93780849 0.94866732 0.96051333 0.95853899 0.9673913  0.83596838 0.85375494]


# =============================================================================
# Random Forest
# =============================================================================


rf=RandomForestClassifier()
rf_fit = rf.fit(X_train_smote ,Y_train_smote)
y_pred_rf = rf.predict(X_test)
y_pred_rf_train = rf.predict(X_train_smote)

# Feature Importance
print(feature_importance(rf))

print(confusion_matrix(Y_test, y_pred_rf))
# [[ 372   47]
#  [  66 2047]]

print(classification_report(Y_test, y_pred_rf))
#               precision    recall  f1-score   support

#            0       0.85      0.89      0.87       419
#            1       0.98      0.97      0.97      2113

#     accuracy                           0.96      2532
#    macro avg       0.91      0.93      0.92      2532
# weighted avg       0.96      0.96      0.96      2532


# =============================================================================
# ROC Curve
# =============================================================================
# decision tree
dc_pred = dc_model.predict_proba(X_test)
print(roc_auc_score(Y_test, dc_pred[:, 1])) #0.8973
fpr, tpr, _ = roc_curve(Y_test, dc_pred[:, 1])

plt.clf()
plt.plot(fpr, tpr)


# random forest
rf_pred = rf.predict_proba(X_test)
print(roc_auc_score(Y_test, rf_pred[:, 1])) #0.9876
rf_fpr, rf_tpr, _ = roc_curve(Y_test, rf_pred[:, 1])
plt.plot(rf_fpr, rf_tpr)

# knn 
knn_pred = knn.predict_proba(X_test)
print(roc_auc_score(Y_test, knn_pred[:, 1])) #0.8896
knn_fpr, knn_tpr, _ = roc_curve(Y_test, knn_pred[:, 1])
plt.plot(knn_fpr, knn_tpr)



# =============================================================================
# Export Result
# =============================================================================

feature_importance_df = pd.DataFrame({'DT': feature_importance(dc_model).iloc[: , 0],
                                      'RF': feature_importance(rf).iloc[:, 0],
                                      'KNN': importance})


#feature_importance_df.to_csv('feature_importance.csv', encoding = 'utf-8')
# data for animated plot

dt_df = feature_importance(dc_model)
dt_importance = pd.DataFrame({'variable': dt_df.index, 'type': 'Decision Tree', 'value': dt_df.iloc[:, 0]})
rf_importance = pd.DataFrame({'variable': dt_df.index, 'type': 'Random Forest', 'value': feature_importance(rf).iloc[:, 0]})
knn_importance = pd.DataFrame({'variable': dt_df.index, 'type': 'KNN', 'value': importance})

importance_df = dt_importance.append(rf_importance, ignore_index = True)
importance_df = importance_df.append(knn_importance, ignore_index = True)
importance_df['value2'] = importance_df['value'] * 100
importance_df.to_csv('importance_df.csv', encoding = 'utf-8')

# =============================================================================
# Export Result2
# =============================================================================
dc_roc = pd.DataFrame({'fpr': fpr, 'tpr': tpr, 'type': 'Decision Tree'})
rf_roc = pd.DataFrame({'fpr': rf_fpr, 'tpr': rf_tpr, 'type': 'Random Forest' })
knn_roc = pd.DataFrame({'fpr': knn_fpr, 'tpr': knn_tpr, 'type': 'KNN'})

roc_df = dc_roc.append(rf_roc, ignore_index = True)
roc_df = roc_df.append(knn_roc, ignore_index = True)

#roc_df.to_csv('roc_data.csv', encoding = 'utf-8')











